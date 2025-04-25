// src/app/chat/chat.component.ts

import { Component } from '@angular/core';
import { OpenAiService } from '../services/open-ai.service';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { ElementRef, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userInput: string = '';
  conversation: { role: string; content: string; source?: string }[] = [];
  @ViewChild('history') historyDiv!: ElementRef<HTMLDivElement>;

private scrollToBottom(): void {
  setTimeout(() => {
    const el = this.historyDiv?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;   // safe assignment
    }
  });
}


  constructor(
    private openAiService: OpenAiService,
    private orderService: OrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {
    // "System" message sets brand guidance
    this.conversation.push({
      role: 'system',
      content: `
        

Your personality is friendly, helpful, and inspired by the outdoors adventures. Use adventurous tone that reflects the spirit of outdoor exploration—think biking, hiking, mountain trails, fresh air, and good gear—but keep it natural human emotions, like a knowledgeable store guide or trail buddy. Feel free to use occasional emojis like ⛰️ or 🌲 and enthusiastic phrases like "Onward into the unknown" or "ready to explore that for you,".

Your job is to help customers with: 

Order status

Product availability

Early Risers Promotion

If a user asks about order status, you must have both an email and an order number to proceed. If either is missing, ask politely for the missing info.

If a user asks about product availability, you must have the SKU. If it’s missing, ask for it.

Do not provide order status, product availability, or promotion details unless they come from assistant messages with role: assistant and source: local.If no order found for email or order number, inform the user.

If a user asks about something outside of order status, product availability, or promotions, gently steer them back to those topics.

Your tone should strike a balance: warm and outdoorsy, but professional and clear—like a helpful guide at a trusted gear shop.

Do not redirect to customer service team.


      `
    });
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add the user's message to conversation
    this.conversation.push({ role: 'user', content: this.userInput });

    // Intercept for order logic, early risers, product availability
    this.checkForOrderStatus(this.userInput);
    this.checkForEarlyRisersPromotion(this.userInput);
    this.checkForProductAvailability(this.userInput);

    // Call OpenAI
    this.openAiService.sendChatRequest(this.conversation).subscribe({
      next: (res) => {
        const aiMessage = res?.choices?.[0]?.message?.content;
        // Add LLM's response to the conversation
        this.conversation.push({ role: 'assistant', content: aiMessage, source: 'llm' });
        // Clear user input
        this.userInput = '';
        this.cdr.detectChanges();   // force DOM update
        this.scrollToBottom(); 
      },
      error: (err) => {
        console.error('OpenAI API Error:', err);
        // Show fallback error message in chat
        this.conversation.push({
          role: 'assistant',
          content: '⛰️ Apologies, adventurer! The trail is blocked at the moment. Please try again.',
          source: 'llm'
        });
      }
    });
    this.scrollToBottom();   
  }

  /**
   * --------------- ORDER STATUS & TRACKING ---------------
   * If user input includes an email + order #, we do a local data lookup
   * and push that info as an assistant message so LLM can incorporate it.
   */
  private checkForOrderStatus(userMsg: string) {
    // regex to find an email + order number #S
    const emailMatch = userMsg.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const orderMatch = userMsg.match(/#[A-Z0-9]+\b/i);

    if (emailMatch && orderMatch) {
      const email = emailMatch[0];
      const orderNum = orderMatch[0];
      const foundOrder = this.orderService.findOrder(email, orderNum);

      if (foundOrder) {
        let msg = `Order status for ${email}, ${orderNum}: **${foundOrder.Status}**.`;
        if (foundOrder.TrackingNumber) {
          msg += ` Tracking link: https://tools.usps.com/go/TrackConfirmAction?tLabels=${foundOrder.TrackingNumber}`;
        } else {
          msg += ' No tracking number available.';
        }
        // Add as "assistant" so LLM can see & respond with brand voice
        this.conversation.push({ role: 'assistant', content: msg,
          source: 'local' });
      } else {
        this.conversation.push({
          role: 'assistant',
          content: `No order found for email=${email} and order #=${orderNum}. Please verify.`,
          source: 'local'
        });
      }
    }
  }

  /**
   * EARLY RISERS PROMOTION
   * If user explicitly requests "early risers" or "10% discount", 
   * we check if local time is 8-10 AM PT. If valid, generate code.
   */
  private checkForEarlyRisersPromotion(userMsg: string) {
    const lowerMsg = userMsg.toLowerCase();
    if (
      lowerMsg.includes('early risers') ||
      lowerMsg.includes('10% discount') ||
      lowerMsg.includes('discount') ||
      lowerMsg.includes('coupon')
    ) {
      // For demonstration, assume local machine time is PT
      const now = new Date();
      const hour = now.getHours(); // 0-23

      // If 8 <= hour < 10, user is eligible
      if (hour >= 8 && hour < 10) {
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const discountMsg = `EARLY RISERS PROMO: 10% OFF with code EARLY10-${randomCode} (valid only 8-10 AM PT).`;
        this.conversation.push({ role: 'assistant', content: discountMsg,
          source: 'local' });
      } else {
        // Not in the correct time window
        this.conversation.push({
          role: 'assistant',
          content: `⛰️ The Early Risers Promotion is available from 8:00 AM to 10:00 AM PT. 
                    You're outside that window, adventurer. But keep climbing to catch the next sunrise!`,
          source: 'local'
        });
      }
    }
  }

  /**
   * PRODUCT AVAILABILITY
   * If user asks "Is <SKU> in stock?" or references a SKU, 
   * we check the local product catalog.
   */
  private checkForProductAvailability(userMsg: string) {
    // look for a pattern like SOWB004 or SOBP001 in the user text.
    const skuMatch = userMsg.match(/(SO[a-zA-Z]{2,}\d{3,})/);
    // Example: "SOWB004", "SOBP001", "SOSB006", etc.

    if (skuMatch) {
      const skuFound = skuMatch[0];
      const prod = this.productService.checkAvailability(skuFound);

      if (prod) {
        if (prod.Inventory > 0) {
          this.conversation.push({
            role: 'assistant',
            content: `Product "${prod.ProductName}" (SKU: ${prod.SKU}) is in stock with ${prod.Inventory} units. 
                      Onward into the unknown!`,
          source: 'local'
          });
        } else {
          this.conversation.push({
            role: 'assistant',
            content: `Product "${prod.ProductName}" (SKU: ${prod.SKU}) is currently out of stock. 
                      Keep exploring for new gear, adventurer!`,
          source: 'local'
          });
        }
      } else {
        this.conversation.push({
          role: 'assistant',
          content: `⛰️ Hm, we don't recognize SKU: ${skuFound}. Are you sure that's correct?`,
          source: 'local'
        });
      }
    }
  }
}
