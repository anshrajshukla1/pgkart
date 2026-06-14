package com.pgkart.service;

import com.pgkart.exceptions.ApiException;
import com.pgkart.exceptions.ResourceNotFoundException;
import com.pgkart.model.*;
import com.pgkart.payload.OrderDTO;
import com.pgkart.payload.OrderItemDTO;
import com.pgkart.payload.OrderResponse;
import com.pgkart.payload.OrderTrackingDTO;
import com.pgkart.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod,
                               String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {
        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "email", emailId);
        }
        if (cart.getCartItems().isEmpty()) {
            throw new ApiException("Cart is empty");
        }

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", addressId, "addressId"));

        // Validate stock availability before placing order
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() != null && product.getStockQuantity() < cartItem.getQuantity()) {
                throw new ApiException("Insufficient stock for: " + product.getProductName());
            }
        }

        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice() != null ? cart.getTotalPrice() : BigDecimal.ZERO);
        order.setOrderStatus("PENDING");
        order.setAddress(address);
        order.setConfirmationEmailSent(false);
        order.setShippedEmailSent(false);
        order.setDeliveredEmailSent(false);

        Payment payment = new Payment(paymentMethod, pgName, pgPaymentId, pgStatus, pgResponseMessage);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderedProductPrice(cartItem.getProductPrice());
            orderItem.setOrder(savedOrder);
            orderItems.add(orderItem);
        }
        orderItems = orderItemRepository.saveAll(orderItems);

        // Deduct stock and clear cart
        List<CartItem> items = new ArrayList<>(cart.getCartItems());
        for (CartItem item : items) {
            Product product = item.getProduct();
            int newStock = (product.getStockQuantity() != null ? product.getStockQuantity() : 0) - item.getQuantity();
            product.setStockQuantity(Math.max(newStock, 0));
            // Also deduct legacy quantity field
            product.setQuantity(Math.max((product.getQuantity() != null ? product.getQuantity() : 0) - item.getQuantity(), 0));
            productRepository.save(product);
            cartService.deleteProductFromCart(cart.getCartId(), item.getProduct().getProductId());
        }

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(savedOrder.getOrderId());
        orderDTO.setEmail(savedOrder.getEmail());
        orderDTO.setOrderDate(savedOrder.getOrderDate());
        orderDTO.setTotalAmount(savedOrder.getTotalAmount());
        orderDTO.setOrderStatus(savedOrder.getOrderStatus());
        if (savedOrder.getAddress() != null) {
            orderDTO.setAddress(modelMapper.map(savedOrder.getAddress(), com.pgkart.payload.AddressDTO.class));
        }
        orderItems.forEach(item -> orderDTO.getOrderItems().add(modelMapper.map(item, OrderItemDTO.class)));

        return orderDTO;
    }

    @Override
    @Transactional
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Order> pageOrders = orderRepository.findAll(pageable);

        OrderResponse response = new OrderResponse();
        response.setContent(pageOrders.getContent().stream()
                .map(o -> modelMapper.map(o, OrderDTO.class)).collect(Collectors.toList()));
        response.setPageNumber(pageOrders.getNumber());
        response.setPageSize(pageOrders.getSize());
        response.setTotalElements(pageOrders.getTotalElements());
        response.setTotalPages(pageOrders.getTotalPages());
        response.setLastPage(pageOrders.isLast());
        return response;
    }

    @Override
    @Transactional
    public OrderDTO updateOrderTracking(Long orderId, OrderTrackingDTO trackingDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId, "orderId"));

        if (trackingDTO.getOrderStatus() != null) order.setOrderStatus(trackingDTO.getOrderStatus());
        if (trackingDTO.getTrackingId() != null) order.setTrackingId(trackingDTO.getTrackingId());
        if (trackingDTO.getCourierName() != null) order.setCourierName(trackingDTO.getCourierName());
        if (trackingDTO.getTrackingUrl() != null) order.setTrackingUrl(trackingDTO.getTrackingUrl());

        return modelMapper.map(orderRepository.save(order), OrderDTO.class);
    }

    @Override
    @Transactional
    public List<OrderDTO> getOrdersByEmail(String email) {
        return orderRepository.findByEmailWithItems(email).stream()
                .map(o -> {
                    OrderDTO dto = new OrderDTO();
                    dto.setOrderId(o.getOrderId());
                    dto.setEmail(o.getEmail());
                    dto.setOrderDate(o.getOrderDate());
                    dto.setTotalAmount(o.getTotalAmount());
                    dto.setOrderStatus(o.getOrderStatus());
                    if (o.getAddress() != null) {
                        dto.setAddress(modelMapper.map(o.getAddress(), com.pgkart.payload.AddressDTO.class));
                    }
                    dto.setTrackingId(o.getTrackingId());
                    dto.setCourierName(o.getCourierName());
                    dto.setTrackingUrl(o.getTrackingUrl());
                    dto.setReturnStatus(o.getReturnStatus());
                    dto.setOrderItems(o.getOrderItems().stream()
                            .map(item -> modelMapper.map(item, OrderItemDTO.class))
                            .collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void requestReturn(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found"));
        if (!order.getEmail().equalsIgnoreCase(email)) {
            throw new ApiException("Unauthorized to return this order");
        }
        if (!"DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new ApiException("Only delivered orders can be returned");
        }
        if (order.getReturnStatus() != null) {
            throw new ApiException("Return already requested for this order");
        }
        order.setReturnStatus("REQUESTED");
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void handleReturnRequest(Long orderId, boolean approve) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found"));
        if (!"REQUESTED".equalsIgnoreCase(order.getReturnStatus())) {
            throw new ApiException("No pending return request for this order");
        }
        if (approve) {
            order.setReturnStatus("APPROVED");
        } else {
            order.setReturnStatus("DECLINED");
        }
        orderRepository.save(order);
    }
}
