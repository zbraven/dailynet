import {Platform} from 'react-native';
import {
  initConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  requestPurchase,
  getProducts,
  getSubscriptions,
  PurchaseError,
  Purchase,
  ProductPurchase,
  SubscriptionPurchase,
} from 'react-native-iap';
import {supabase} from './supabase';
import {Subscription} from '../types';

const PREMIUM_PRODUCT_ID = Platform.OS === 'ios' ? 'daily_net_premium_monthly' : 'daily_net_premium_monthly';

class SubscriptionService {
  private isInitialized = false;
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await initConnection();
      
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('Purchase successful:', purchase);
          await this.handlePurchaseUpdate(purchase);
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.log('Purchase error:', error);
        }
      );

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing IAP:', error);
    }
  }

  async getSubscriptionStatus(): Promise<Subscription | null> {
    try {
      const {data, error} = await supabase
        .from('subscriptions')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
  }

  async isPremiumUser(): Promise<boolean> {
    try {
      const subscription = await this.getSubscriptionStatus();
      
      if (!subscription) return false;
      
      if (subscription.plan !== 'premium') return false;
      
      if (subscription.status !== 'active') return false;
      
      // Check if subscription is still valid
      if (subscription.expires_at) {
        const expiryDate = new Date(subscription.expires_at);
        const now = new Date();
        return expiryDate > now;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  async purchasePremium(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Get available products
      const products = await getSubscriptions([PREMIUM_PRODUCT_ID]);
      
      if (products.length === 0) {
        throw new Error('Premium subscription not available');
      }

      // Request purchase
      await requestPurchase({sku: PREMIUM_PRODUCT_ID});
      
      return true;
    } catch (error) {
      console.error('Error purchasing premium:', error);
      throw error;
    }
  }

  private async handlePurchaseUpdate(purchase: Purchase): Promise<void> {
    try {
      // Verify purchase with your backend if needed
      // For now, we'll trust the purchase and update the database
      
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Monthly subscription
      
      const {error} = await supabase
        .from('subscriptions')
        .upsert({
          plan: 'premium',
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiryDate.toISOString(),
        });

      if (error) {
        console.error('Error updating subscription:', error);
      }

      // Finish the transaction
      await finishTransaction({purchase, isConsumable: false});
    } catch (error) {
      console.error('Error handling purchase update:', error);
    }
  }

  async restorePurchases(): Promise<void> {
    // This would restore previous purchases
    // Implementation depends on your specific needs
    console.log('Restore purchases not implemented yet');
  }

  cleanup(): void {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
  }
}

export const subscriptionService = new SubscriptionService();