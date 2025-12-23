import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahfsqtexhxthstxkbnpa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZnNxdGV4aHh0aHN0eGtibnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTA4NjMsImV4cCI6MjA4MTY4Njg2M30.Mp_zRKsmuLdjK6WU5k_8Bi2CqQz-FQHK4kpu_bEW-ak';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库类型定义
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'vip' | 'new';
  avatar: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  items_count: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  model: string;
  created_at: string;
}

export interface DailyMetrics {
  id: string;
  date: string;
  total_revenue: number;
  total_orders: number;
  active_customers: number;
  conversion_rate: number;
  created_at: string;
}

// API服务函数
export const api = {
  // 客户相关
  customers: {
    async getAll() {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Customer[];
    },
    async getById(id: string) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Customer;
    },
    async getStats() {
      const { data, error } = await supabase
        .from('customers')
        .select('status');
      if (error) throw error;
      const stats = {
        total: data.length,
        active: data.filter(c => c.status === 'active').length,
        vip: data.filter(c => c.status === 'vip').length,
        inactive: data.filter(c => c.status === 'inactive').length,
        new: data.filter(c => c.status === 'new').length,
      };
      return stats;
    },
    async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      if (error) throw error;
      return data as Customer;
    },
    async update(id: string, customer: Partial<Customer>) {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...customer, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Customer;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // 产品相关
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
    async getByCategory(category: string) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
      if (error) throw error;
      return data as Product[];
    },
    async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    async update(id: string, product: Partial<Product>) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...product, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // 订单相关
  orders: {
    async getAll() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
    async getById(id: string) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Order;
    },
    async getRecent(limit: number = 5) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Order[];
    },
    async getByStatus(status: string) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
    async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();
      if (error) throw error;
      return data as Order;
    },
    async update(id: string, order: Partial<Order>) {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...order, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Order;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // 聊天记录相关
  chat: {
    async getMessages(sessionId: string) {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as ChatMessage[];
    },
    async saveMessage(message: Omit<ChatMessage, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(message)
        .select()
        .single();
      if (error) throw error;
      return data as ChatMessage;
    }
  },

  // 仪表盘数据相关
  metrics: {
    async getDaily(days: number = 7) {
      const { data, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .order('date', { ascending: true })
        .limit(days);
      if (error) throw error;
      return data as DailyMetrics[];
    },
    async getKPIs() {
      const today = new Date().toISOString().split('T')[0];
      const { data: todayMetrics } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('date', today)
        .single();

      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount');

      const { data: customers } = await supabase
        .from('customers')
        .select('id');

      const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;
      const totalCustomers = customers?.length || 0;

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        conversionRate: todayMetrics?.conversion_rate || 3.24,
      };
    }
  }
};

// 用户设置相关
export interface UserSettings {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  language: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export const settingsApi = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as UserSettings | null;
  },
  async upsert(userId: string, settings: Partial<UserSettings>) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw error;
    return data as UserSettings;
  }
};

export default supabase;
