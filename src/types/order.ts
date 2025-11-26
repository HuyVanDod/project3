/**
 * Định nghĩa cấu trúc cho một sản phẩm trong danh sách tóm tắt đơn hàng.
 */
export interface OrderSummaryItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  image: string; // Chuỗi JSON chứa URL ảnh
}

/**
 * Định nghĩa cấu trúc cho một đơn hàng trong danh sách "My Orders".
 */
export interface OrderListSummary {
  id: string;
  order_number: string;
  order_date: string;
  order_status: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  items: OrderSummaryItem[];
}

/**
 * Định nghĩa chi tiết cho một sản phẩm trong đơn hàng (từ API chi tiết).
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  variant_sku: string | null;
  variant_name: string | null;
  image: string; 
  weight: string;
  length: string | null;
  width: string | null;
  height: string | null;// Chuỗi JSON chứa URL ảnh
}

/**
 * Định nghĩa lịch sử trạng thái của đơn hàng.
 */
export interface OrderHistory {
  id: string;
  order_id: string;
  from_status: string | null;
  to_status: string;
  notes: string;
  changed_by: string | null;
  created_at: string;
  changed_by_name: string | null;
}

/**
 * Định nghĩa thông tin vận chuyển của đơn hàng.
 */
export interface OrderShipment {
  id: string;
  order_id: string;
  carrier_id: string | null;
  tracking_number: string;
  shipping_method: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  shipping_cost: string;
  status: string;
  delivery_notes: string | null;
  carrier_code: string;
  estimated_delivery_date: string;
}

/**
 * Định nghĩa thông tin thanh toán của đơn hàng.
 */
export interface OrderPayment {
  id: string;
  order_id: string;
  payment_method: string;
  amount: number;
  transaction_id: string | null;
  gateway: string | null;
  status: string;
  payment_date: string | null;
  notes: string | null;
}

/**
 * Định nghĩa chi tiết cho một đơn hàng (từ API tạo mới và chi tiết).
 */
export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  order_date: string;
  order_status: string;
  total_amount: string;
  shipping_address_id: string | null;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  shipping_province: string;
  shipping_district: string;
  shipping_ward: string;
  subtotal: string;
  shipping_fee: string;
  discount_amount: string;
  tax_amount: string;
  required_date: string | null;
  shipping_status: number;
  coupon_code: string | null;
  notes: string | null;
  internal_notes: string | null;
  assigned_to: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_by: string | null;
  
  // Thông tin lồng vào từ API chi tiết
  items?: OrderItem[];
  history?: OrderHistory[];
  shipment?: OrderShipment;
  payments?: OrderPayment[];
}

/**
 * Định nghĩa cấu trúc cho tùy chọn vận chuyển khi tạo đơn hàng.
 */
export interface OrderShippingOption {
  fee: number;
  service_id: number;
  service_type_id: number;
}

/**
 * Định nghĩa cấu trúc payload để tạo một đơn hàng mới.
 */
export interface CreateOrderPayload {
  addressId: number;
  shippingOption: OrderShippingOption;
  paymentMethod: string;
  notes?: string;
}

/**
 * Định nghĩa cấu trúc phản hồi khi tạo đơn hàng thành công.
 */
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: Order; // chứa id, payment_method, payment_status, v.v
  shipment: {
    tracking_number: string;
    carrier: string;
    fee: number;
    expected_delivery_time: string;
  };
  paymentUrl: string | null;
}


export type PaymentMethod = 'cod' | 'momo';