--
-- PostgreSQL database dump
--

\restrict REZOcbOqcnpOrlOIUnWxFghD475bQEEhOMIT8IBUEe82McNLCoeS1ngprUsvxYG

-- Dumped from database version 18.4 (df16b3c)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.addresses (
    address_id bigint NOT NULL,
    street character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    pincode character varying(6) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL,
    user_id bigint,
    mobile_number character varying(15)
);


ALTER TABLE public.addresses OWNER TO neondb_owner;

--
-- Name: addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.addresses_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_address_id_seq OWNER TO neondb_owner;

--
-- Name: addresses_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.addresses_address_id_seq OWNED BY public.addresses.address_id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cart_items (
    cart_item_id bigint NOT NULL,
    cart_id bigint,
    product_id bigint,
    quantity integer DEFAULT 1 NOT NULL,
    discount numeric(5,2) DEFAULT 0,
    product_price numeric(10,2) NOT NULL
);


ALTER TABLE public.cart_items OWNER TO neondb_owner;

--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cart_items_cart_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNER TO neondb_owner;

--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cart_items_cart_item_id_seq OWNED BY public.cart_items.cart_item_id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.carts (
    cart_id bigint NOT NULL,
    user_id bigint,
    total_price numeric(10,2) DEFAULT 0.0
);


ALTER TABLE public.carts OWNER TO neondb_owner;

--
-- Name: carts_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.carts_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_cart_id_seq OWNER TO neondb_owner;

--
-- Name: carts_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.carts_cart_id_seq OWNED BY public.carts.cart_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    category_id bigint NOT NULL,
    category_name character varying(100) NOT NULL
);


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO neondb_owner;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.coupons (
    coupon_id bigint NOT NULL,
    code character varying(255) NOT NULL,
    discount_type character varying(255),
    discount_value numeric(38,2),
    is_active boolean DEFAULT true NOT NULL,
    min_order_value numeric(38,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.coupons OWNER TO neondb_owner;

--
-- Name: coupons_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.coupons_coupon_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupons_coupon_id_seq OWNER TO neondb_owner;

--
-- Name: coupons_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.coupons_coupon_id_seq OWNED BY public.coupons.coupon_id;


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO neondb_owner;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.order_items (
    order_item_id bigint NOT NULL,
    order_id bigint,
    product_id bigint,
    quantity integer NOT NULL,
    discount numeric(5,2) DEFAULT 0,
    ordered_product_price numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO neondb_owner;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.order_items_order_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_order_item_id_seq OWNER TO neondb_owner;

--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.order_items.order_item_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    email character varying(100) NOT NULL,
    order_date date NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    order_status character varying(50) DEFAULT 'PENDING'::character varying,
    tracking_id character varying(100),
    courier_name character varying(100),
    tracking_url character varying(500),
    confirmation_email_sent boolean DEFAULT false,
    shipped_email_sent boolean DEFAULT false,
    delivered_email_sent boolean DEFAULT false,
    payment_id bigint,
    address_id bigint,
    return_status character varying(255),
    applied_coupon_code character varying(255),
    discount_amount numeric(38,2),
    delivery_fee numeric(10,2) DEFAULT 0.00
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.orders_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO neondb_owner;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    token character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    expiry_date timestamp without time zone NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO neondb_owner;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO neondb_owner;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payments (
    payment_id bigint NOT NULL,
    payment_method character varying(50) NOT NULL,
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    razorpay_signature character varying(200),
    pg_status character varying(50),
    pg_response_message character varying(255)
);


ALTER TABLE public.payments OWNER TO neondb_owner;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.payments_payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO neondb_owner;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    product_id bigint NOT NULL,
    product_name character varying(255) NOT NULL,
    image character varying(500),
    product_description text NOT NULL,
    quantity integer DEFAULT 0,
    price numeric(10,2) NOT NULL,
    discount numeric(5,2) DEFAULT 0,
    special_price numeric(10,2),
    stock_quantity integer DEFAULT 0,
    low_stock_threshold integer DEFAULT 5,
    category_id bigint,
    is_featured boolean DEFAULT false NOT NULL
);


ALTER TABLE public.products OWNER TO neondb_owner;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.products_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO neondb_owner;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(20) NOT NULL
);


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO neondb_owner;

--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.user_roles OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(120) NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO neondb_owner;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: addresses address_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addresses ALTER COLUMN address_id SET DEFAULT nextval('public.addresses_address_id_seq'::regclass);


--
-- Name: cart_items cart_item_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN cart_item_id SET DEFAULT nextval('public.cart_items_cart_item_id_seq'::regclass);


--
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_cart_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: coupons coupon_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupons ALTER COLUMN coupon_id SET DEFAULT nextval('public.coupons_coupon_id_seq'::regclass);


--
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.addresses (address_id, street, city, state, pincode, country, user_id, mobile_number) FROM stdin;
1	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
2	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
3	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
4	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
5	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
6	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
7	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
8	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
9	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
10	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
11	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
12	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
13	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
14	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
15	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
16	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	6	9690772864
17	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	6	9690772864
18	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	6	9690772864
19	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	6	9690772864
20	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
21	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
22	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
23	Yello living 	Bareilluy	Up	243001	India	6	9690772864
24	32 chaudhary mohalla	Bareilly	Uttar pradesb	243001	India	6	9690772864
25	32, Gulab Nagar, Near Brahm Dev Mandir, Chaudhri Mohalla Nawabganj Bareilly Uttar Pradesh India, 243001	Bareilly	Uttar Pradesh	243001	India	6	9690772864
26	Yrehdb	Blr	Karnataka	560066	India	7	9690772864
27	Yrehdb	Blr	Karnataka	560066	India	7	9690772864
28	Yello	Bangalore	Uttarakhand	243010	India	8	7374383939
29	28, 2nd cross	Bengaluru	Karnataka	560100	India	10	7696967041
30	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
31	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
32	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
33	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
34	Subhash Nagar	Bareilly	Uttar Pradesh	243001	India	11	9759675540
35	Subhash Nagar	Bareilly	Uttar Pradesh	243001	India	11	9759675540
36	Subhash Nagar	Bareilly	Uttar Pradesh	243001	India	11	9759675540
37	438753	jhebgekjvbv	Uttar Pradesh	243001	India	12	8979274928
38	Uashhds	BANGALORE	Karnataka	527363	India	13	7456456457
39	Subhash nagar	Bly	Uttar Pradesh	243001	India	11	9767744677
40	PO PS- RAFIGANJ	W/O RAJESH KUMAR	Bihar	824125	India	14	8002231318
41	yello living , pattandur agrahara	Bengaluru	Karnataka	243001	India	4	9690772864
42	Ughara, Anandpur, Darbhanga	Laheriasarai	Bihar	847101	India	17	6203755918
43	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
44	Hsbsbs	Bengaluru	Uttar Pradesh	243001	India	19	8384747382
45	yello living , pattandur agrahara	Bengaluru	Karnataka	560066	India	4	9690772864
46	S 576 Behind ICICI Bank, Near Sarveshwar Durga Dham Mandir Nehru Nagar	Bhopal	Madhya Pradesh	462003	India	20	7986363746
47	S 576 Behind ICICI Bank, Near Sarveshwar Durga Dham Mandir Nehru Nagar	Bhopal	Madhya Pradesh	462003	India	20	7986363746
48	shivnagar	Sikar	Rajasthan	332027	India	21	6376400524
49	shivnagar	Sikar	Rajasthan	332027	India	21	6376400524
50	Yello Living 305	Whitefield 	Karnataka	560066	India	24	8310490541
51	D221, yello living 	Banglore 	Karnataka	560066	India	30	8529099343
52	D 106 , yello Co-Living	Bangalore	Karnataka	560066	India	33	9799247019
53	422 A Yello Living 	Bengaluru 	Karnataka	560066	India	35	7847011413
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cart_items (cart_item_id, cart_id, product_id, quantity, discount, product_price) FROM stdin;
13	3	1	1	19.00	323.19
55	17	32	1	1.00	29.70
56	18	39	1	7.00	203.67
57	19	73	1	0.00	49.00
58	19	74	1	10.00	89.10
59	19	41	1	0.00	20.00
17	2	18	1	0.00	149.00
60	20	67	1	0.00	30.00
61	20	41	1	0.00	20.00
62	21	72	1	8.00	72.68
63	21	30	1	0.00	99.00
64	21	5	1	10.00	161.10
65	22	66	1	0.00	30.00
66	22	67	1	0.00	30.00
71	4	38	1	0.00	20.00
72	26	72	1	8.00	72.68
29	8	18	1	0.00	149.00
76	25	50	1	0.00	99.00
30	2	8	1	12.00	114.40
77	25	59	1	4.00	143.04
78	25	48	1	0.00	79.00
79	25	38	1	0.00	20.00
82	23	26	1	0.00	99.00
83	30	31	1	2.00	146.02
84	30	30	1	0.00	99.00
33	11	2	1	0.00	2.00
42	9	60	1	5.00	141.55
43	7	60	1	5.00	141.55
48	13	72	1	8.00	72.68
50	14	62	1	5.00	141.55
51	14	63	1	0.00	99.00
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.carts (cart_id, user_id, total_price) FROM stdin;
24	30	0.00
3	7	323.19
4	8	20.00
26	32	72.68
5	10	0.00
6	2	0.00
9	13	141.55
7	11	141.55
27	33	0.00
28	34	0.00
25	31	341.04
12	17	0.00
13	18	72.68
8	12	149.00
2	6	263.40
23	29	99.00
10	14	0.00
14	19	240.55
1	4	0.00
30	36	245.02
15	20	0.00
29	35	0.00
16	21	0.00
17	23	29.70
18	24	203.67
11	15	2.00
19	25	158.10
20	26	50.00
21	27	332.78
22	28	60.00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (category_id, category_name) FROM stdin;
1	Bath & Toiletries
2	Study Essentials
3	Kitchen Basics
5	Storage & Organization
8	Electronics & Accessories
9	Room Essentials
10	Daily Utility
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.coupons (coupon_id, code, discount_type, discount_value, is_active, min_order_value) FROM stdin;
1	ANSH100	FLAT	100.00	t	499.00
2	YELLOFREE	FREE_DELIVERY	0.00	t	0.00
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	initial schema	SQL	V1__initial_schema.sql	-250378838	neondb_owner	2026-06-14 06:34:16.364911	507	t
2	2	seed categories	SQL	V2__seed_categories.sql	-1759779695	neondb_owner	2026-06-14 06:34:18.863922	102	t
3	3	add mobile number to addresses	SQL	V3__add_mobile_number_to_addresses.sql	160546765	neondb_owner	2026-06-14 06:34:19.16801	101	t
4	4	add return status to orders	SQL	V4__add_return_status_to_orders.sql	-1242140190	neondb_owner	2026-06-14 06:34:19.559024	199	t
5	5	seed roles and admin	SQL	V5__seed_roles_and_admin.sql	823993292	neondb_owner	2026-06-14 08:37:33.262004	409	t
6	6	update admin password	SQL	V6__update_admin_password.sql	-2101867075	neondb_owner	2026-06-14 08:46:16.948792	400	t
7	7	create password reset tokens	SQL	V7__create_password_reset_tokens.sql	255587119	neondb_owner	2026-06-14 09:38:05.917156	299	t
8	8	add featured products and coupons	SQL	V8__add_featured_products_and_coupons.sql	-1619645779	neondb_owner	2026-06-16 05:32:21.257715	333	t
9	9	add min order value to coupons	SQL	V9__add_min_order_value_to_coupons.sql	-2136109827	neondb_owner	2026-06-16 05:41:27.083907	398	t
10	10	add delivery fee to orders	SQL	V10__add_delivery_fee_to_orders.sql	2037000770	neondb_owner	2026-06-17 04:58:58.559571	398	t
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.order_items (order_item_id, order_id, product_id, quantity, discount, ordered_product_price) FROM stdin;
8	8	2	1	0.00	2.00
11	11	2	1	0.00	2.00
12	12	2	1	0.00	2.00
13	13	2	1	0.00	2.00
14	14	2	1	0.00	2.00
15	15	2	1	0.00	2.00
16	16	2	1	0.00	2.00
17	17	5	1	10.00	161.10
18	18	2	1	0.00	2.00
19	19	73	1	0.00	49.00
20	20	2	1	0.00	2.00
21	21	38	1	0.00	20.00
22	22	34	1	0.00	149.00
23	22	32	1	1.00	29.70
24	23	41	2	0.00	20.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (order_id, email, order_date, total_amount, order_status, tracking_id, courier_name, tracking_url, confirmation_email_sent, shipped_email_sent, delivered_email_sent, payment_id, address_id, return_status, applied_coupon_code, discount_amount, delivery_fee) FROM stdin;
14	ayushmishr99119@gmail.com	2026-06-16	2.00	Delivered	\N	\N	\N	f	t	t	14	38	APPROVED	\N	0.00	0.00
15	anshrajshukla.official@gmail.com	2026-06-17	2.00	Delivered	\N	\N	\N	f	f	t	15	41	\N	YELLOFREE	0.00	0.00
16	jharaushan423@gmail.com	2026-06-18	2.00	Delivered	\N	\N	\N	f	t	t	16	42	\N	YELLOFREE	0.00	0.00
17	anshrajshukla.official@gmail.com	2026-06-19	161.10	PENDING	\N	\N	\N	f	f	f	17	43	\N	\N	0.00	59.00
12	anshrajshukla.official@gmail.com	2026-06-16	2.00	Cancelled	\N	\N	\N	f	f	f	12	33	\N	\N	0.00	0.00
18	anshrajshukla.official@gmail.com	2026-06-20	2.00	PENDING	\N	\N	\N	f	f	f	18	45	\N	YELLOFREE	0.00	10.00
8	anshrajshukla546@gmail.com	2026-06-14	2.00	PENDING	\N	\N	\N	f	f	f	8	24	\N	\N	\N	0.00
19	sonu.nahar007@gmail.com	2026-06-20	49.00	Delivered	\N	\N	\N	f	t	t	19	47	APPROVED	YELLOFREE	0.00	10.00
20	mohitjangidworks@gmail.com	2026-06-20	2.00	Delivered	\N	\N	\N	f	t	t	20	49	APPROVED	YELLOFREE	0.00	10.00
11	udhay.nayyar01@sarasai.org	2026-06-16	2.00	Delivered	\N	\N	\N	f	t	t	11	29	\N	\N	\N	0.00
21	lokendras49450@gmail.com	2026-06-26	20.00	Cancelled	\N	\N	\N	f	f	f	21	51	\N	YELLOFREE	0.00	10.00
13	aditishukla29700@gmail.com	2026-06-16	2.00	Delivered	\N	\N	\N	f	t	t	13	34	\N	\N	0.00	0.00
22	sumitsinghyadav097@gmail.com	2026-07-05	178.70	Shipped	\N	\N	\N	f	t	f	22	52	\N	\N	0.00	49.00
23	akankshaprath@gmail.com	2026-07-17	40.00	PENDING	\N	\N	\N	f	f	f	23	53	\N	YELLOFREE	0.00	0.00
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.password_reset_tokens (id, token, user_id, expiry_date) FROM stdin;
4	cef98a07-9260-48b5-bb24-37f6e6ba8a5f	13	2026-06-16 10:01:20.10524
6	b4fd7823-fcd8-4e23-b4b5-cdcb3ed926a9	19	2026-06-19 13:07:51.725861
8	068af167-7ff0-4601-a206-eb2a484438f6	21	2026-06-20 14:27:28.382459
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (payment_id, payment_method, razorpay_order_id, razorpay_payment_id, razorpay_signature, pg_status, pg_response_message) FROM stdin;
1	RAZORPAY	order_T1TjqGXQm5wlf9	pay_T1Tk9lXFMccUdf	8244665fe3ad87ba684a100ecaaec780402c8813039f3f66f8dbdcca852910f6	PAYMENT_SUCCESS	\N
2	RAZORPAY	order_T1Tzeh6FOYSMI8	pay_T1Tzw4GAnjVCvi	6e57d8d1a6b200cf81d01bdd6349fa8f23f54b68fb1757eb21ee4f62c6d2f5d0	PAYMENT_SUCCESS	\N
3	RAZORPAY	order_T1UGYWe11HfpfE	pay_T1UGwfU7uVbBAL	21b6d259848f8e9ca5177472d6bd7e35f155181c6cea3a737d31814cdd835b5f	PAYMENT_SUCCESS	\N
4	RAZORPAY	order_T1VMEJMjh8gYK5	pay_T1VMNQ2oBOSnsa	0c0e495fecc3af8eab404148f41a02c5743cfd61bb0ce17a9ebe4b10f4866295	PAYMENT_SUCCESS	\N
5	RAZORPAY	order_T1Vibjs9q5zyxS	pay_T1VipipFR1esve	3b67fdcd72d82b946548da8a030ffe590e206eae034742554d7a6534ad2f2300	PAYMENT_SUCCESS	\N
6	RAZORPAY	order_T1WtCCY8MIRDZJ	pay_T1WtQUzXDqn4py	99c36bb4897c35f15071ba8cc78cb159af8aeb24684278db3b601a385d8e770c	PAYMENT_SUCCESS	\N
7	RAZORPAY	order_T1XMidNMxKDhl9	pay_T1XORw23t3BjCq	1907449a75859e20e21f352e779b11d8b676b5c18aafd8b52733d0916768d94b	PAYMENT_SUCCESS	\N
8	RAZORPAY	order_T1YQQWbjPxDfVZ	pay_T1YQZPVIvkuymz	87e4a40f616aa591d96095bc480c22f2ec7e326bf0b56937f82005d09b5a36a2	PAYMENT_SUCCESS	\N
9	RAZORPAY	order_T1akdpPbnlsWgz	pay_T1akhcqF3NW2To	fd75678ecdabe9650bb28ff0e6cae6d8e7adb00daa994702e3df2832ca9a1f67	PAYMENT_SUCCESS	\N
10	RAZORPAY	order_T1gOyOHZgXvETI	pay_T1gP77wkrCowav	7b32647c6aa4c7bb84689c0a67515355e1b39e5714aebe83aa848c9769096e2f	PAYMENT_SUCCESS	\N
11	RAZORPAY	order_T29uu5e9jzK36z	pay_T29v5UXKGeIv4j	97bc5fe99549b19e27fc8f7b1c548ab4dfb5607e46b1e64fc0c9f3ca0d5e146f	PAYMENT_SUCCESS	\N
12	RAZORPAY	order_T2CPR3bhEVR1r7	pay_T2CPm1lSUn72re	a830403a29f72d57851a601b95cb32a6e3f71f61f1b4d94e0e74166c7e427679	PAYMENT_SUCCESS	\N
13	RAZORPAY	order_T2ENmh1KyrKxfK	pay_T2ENzRWbkP5w8Q	866e4ea2ed13efb5eaab338df6dbab155408a5cb24aa4927ccfaba4c98daf7ba	PAYMENT_SUCCESS	\N
14	RAZORPAY	order_T2FBTS8Dt2JyZd	pay_T2FBpVtjefcxCc	b55d87eea83a7f55f891ae173a62b2192ec279f4847b6a6f8356ef028b0fcab1	PAYMENT_SUCCESS	\N
15	RAZORPAY	order_T2e0A9ypAhxN93	pay_T2e0Unc336G5J0	7a9b95adb556e0f9b6aa0edce05ecd3ad838b811734e7336dabea4e6db8d50b3	PAYMENT_SUCCESS	\N
16	RAZORPAY	order_T39CAUgI1xIYiy	pay_T39CNlbyA3WaIq	38563dd1474f501dbdcc3506f105c8635d84548e1b26631d58755880dffd74c0	PAYMENT_SUCCESS	\N
17	COD	COD-1781857677436	\N	\N	PENDING_COD	\N
18	COD	COD-1781950126726	\N	\N	PENDING_COD	\N
19	COD	COD-1781952412146	\N	\N	PENDING_COD	\N
20	COD	COD-1781961910209	\N	\N	PENDING_COD	\N
21	COD	COD-1782497875045	\N	\N	PENDING_COD	\N
22	RAZORPAY	order_T9g7bW3jJ2YjSz	pay_T9g8pkdgEa8eNO	7b16395ce053774a9faf5d5bf50fb573b0a147d8ae2f96c164fd00f91186042b	PAYMENT_SUCCESS	\N
23	RAZORPAY	order_TEbaY21ibxc3LX	pay_TEbafmQGiBysAB	307d176bb0e7991986fad3b76c55124e88c3d59f369ddee74190167db8a8a8f1	PAYMENT_SUCCESS	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (product_id, product_name, image, product_description, quantity, price, discount, special_price, stock_quantity, low_stock_threshold, category_id, is_featured) FROM stdin;
15	2-in-1 Window Slot Cleaning Brush with Dustpan	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781587548/pgkart/products/uzx4zyzchrnymm5ci1rh.webp	Keep your home spotless with this versatile 2-in-1 Window Slot Cleaning Brush. Perfect for narrow and hard-to-reach spaces, it combines a durable brush and mini dustpan for efficient cleaning.\n\nCompact size (17.5 x 2 x 1.2 cm) for precision cleaning\nDurable nylon bristles remove dirt effectively\nComfortable, non-slip plastic handle for easy use\nIncludes mini dustpan for quick debris collection\nIdeal for window grooves, door tracks, computer vents, car interiors, and more\nSpace-saving design with hanging hole	50	49.00	0.00	49.00	50	\N	9	f
17	Wet & Dry Cotton Pad Floor Mop with Long Aluminium Handle - Large	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781588068/pgkart/products/bkqyv8axx9txbsvfp4sv.webp	Keep your floors spotless with this versatile Wet and Dry Cotton Pad Floor Mop featuring a durable long aluminium handle. Designed for efficient cleaning of hardwood, laminate, tile, stone, and concrete floors, it offers 360-degree head movement for easy access to every corner.	10	499.00	0.00	499.00	10	\N	9	f
32	Star-Shaped Plastic Soap Case Holder with Self Design	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781672841/pgkart/products/m6srnnc4sy6883dw43yg.webp	Keep your soap dry and organized with this star-shaped plastic soap case holder, designed for bathrooms, kitchens, and washbasins.\n\nMade of high-quality durable plastic, non-fading and easy to clean.\nSelf-drain design prevents water accumulation to extend soap life.\nVentilated with hollow drain container for freshness and dryness.\nFlip cover provides water and dust protection.\nStylish star shape adds a decorative touch to your space.\nCompact dimensions: 12cm x 9cm x 4cm	17	30.00	1.00	29.70	17	\N	1	f
33	3-IN-1 Waterproof Transparent Travel Toiletry Bag Set - Large, Medium, Small	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781672972/pgkart/products/amqtyknolh5kibt38ymn.webp	Keep your toiletries, makeup, skincare, and personal care essentials neatly organized and easily accessible. This set includes three bags in large, medium, and small sizes—each crafted with durable waterproof material and a transparent front panel for quick visibility.\n\nThree Sizes in One Set: Perfectly sized bags to fit all your travel needs\nWaterproof & Easy to Clean: Protects your items and maintains hygiene\nSecure Zipper Closure: Prevents spills and keeps contents safe\nCarrying Handle: Convenient to carry or hang anywhere on the go\nSpace-Saving Design: Compact and foldable for easy packing in any bag\nMultipurpose Use: Ideal for travel, gym, office, baby care, and more	10	219.00	7.00	203.67	10	\N	1	f
27	3-Fold Cute Umbrella with UV Shield & Zip Case – Compact Sun & Rain Protection	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781671057/pgkart/products/sf0n0t1wubu5cubf5vhy.webp	Stay protected from sun and rain with this compact 3-fold umbrella featuring UV shield technology.	30	299.00	10.00	269.10	30	\N	10	t
26	3-Compartment First Aid Box – Portable Medicine Storage with Tray & Clear Lid	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781670827/pgkart/products/jaz8zjrwjmxvr9dsn5li.webp	Handy first aid medical box, essential to deal with minor accidents or injuries. Its compact shape facilitates easy storage of all basic medical equipment’s.\n\nThe see-through lid, which makes it easy for you to identify the contents easily even without opening the box. Additional partition helps segregate the equipment’s and Medicines so you can find the correct medicine at the time of emergency.\n\nIt is BPA Free, Reusable and Recyclable. The attached handle makes it convenient to carry. Made of highly durable and strong quality plastic for long term use.\n\nThe box can be easily stored in a medical cabinet or in your car because of its compact shape. This medical box comes with a Cross symbol on the body, which makes it easily recognizable as a first aid kit.\n	20	99.00	0.00	99.00	20	\N	10	f
36	Multipurpose Wall Mount Metal Bathroom Shelf and Rack for Home and Kitchen.	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781674565/pgkart/products/smzze9hlpe1lpfiidkns.webp	Kitchen Bathroom Stainless Steel Wall Mounted Single Layer Self Adhesive Magic Sticker Soap Dish Holder Wall Hanging Soap Storage Rack\n\nDo not take space in your bathroom.\nReusable: Simply unlock the suction cup to remove and re-position the soap dish. So that soap and other fixed placement, storage more neat appearance, sucker installation, quick and easy, load-bearing, amazing suction.\nQuickly drain, so that the soap in a dry state, to extend the life of the soap. No need to punch, install directly, Free to change the location, without compromising the wall, repeated use, when you want to change position, remove the magic sucker, after washing. The best natural dry, you can also use the dryer cold air dry, sucker dry, the installation to the location you want to install.	20	139.00	0.00	139.00	20	\N	1	f
2	Test Product	\N	just for test	999989	2.00	0.00	2.00	999989	\N	9	f
28	3-Fold Foldable UV & Rain Protective Travel Umbrella	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781671160/pgkart/products/qrwxrocfb6t2mz5nif5k.webp	UV Protection: High-density fabric reduces heat and shields you from harmful rays.\nWaterproof & Windproof: Durable structure withstands strong winds and heavy rain.\nLightweight & Portable: Compact size fits easily in bags and backpacks for convenience.\nComfortable Grip: Easy to hold and open manually with a sturdy handle.\nMix Designs: Includes one umbrella with assorted stylish patterns.	20	198.99	0.00	198.99	20	\N	10	f
13	Mini Trash Can with Lid – Compact Plastic Desk Dustbin 20×13 cm	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781587009/pgkart/products/wqt6t66qqtjtbzenbhyp.webp	Durable polypropylene plastic with smooth surface and rounded edges\nWide opening design for easy waste disposal\nPerfect for small trash like tissue, cotton pads, hair, and pocket waste\nIdeal for home, office, bedroom, bathroom, or car use\nDimensions: 20 cm (H) × 13 cm (W)	20	199.00	6.00	187.06	20	\N	9	f
29	Strong Double Sided Foam Mounting Tape – 2 Pcs Set	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781671631/pgkart/products/c2vkqjjqaabecv4uhm96.webp	Wall-safe adhesive leaves no residue or damage on removal\nWorks on both uniform & uneven surfaces\nPerfect for mounting heavy tools, vinyl, teaching materials & more\nMulti-purpose use: home, office, advertising & repairing applications\nDimensions: 28cm x 13cm x 3cm (length x breadth x height)	30	80.00	1.00	79.20	30	\N	10	f
18	No Drill 18-Pack Self-Adhesive Wall Hooks - Strong Wooden Look Hangers 	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781588675/pgkart/products/ne8kkthlpljpqbt6zxf8.webp	Transform your home organization with our 18-Pack Self-Adhesive Wall Hooks! Say goodbye to drills, nails, and tools. These heavy-duty hangers feature a strong pre-applied sticky backing that adheres firmly to smooth surfaces like tiles, glass, painted walls, wood, and metal, ensuring a secure hold without any damage to your walls.	20	149.00	9.00	135.59	20	\N	9	t
4	Adjustable Stainless Stee (12 Pcs)l Hangers with Anti-Rust Clips	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781584071/pgkart/products/mvtlqwvjocvejj5nv3bu.webp	Made from high-quality stainless steel for strength and durability\nAdjustable clip widths fit various clothing sizes including children's and adults'\nBlack rubber-coated clips increase friction and protect fabrics\n360-degree swivel hook for easy hanging and access\nSlim metal structure saves wardrobe space and keeps clothes tidy	20	249.00	15.00	211.65	20	\N	9	f
14	Modern Multipurpose Dustbin	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781587325/pgkart/products/q53oiswtumxk58thcdbq.webp	Keep your space tidy with this modern multipurpose dustbin, perfect for office and home use. Its compact square design fits neatly in corners or under desks, blending seamlessly with any décor.	199	199.00	0.00	199.00	199	\N	9	f
16	Pro Clean Adjustable Stainless Steel Floor Wiper with Telescopic Handle	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781587976/pgkart/products/iktu3y3kvxkiu09uyx5d.webp	Keep your floors spotless with the Pro Clean Adjustable Floor Wiper, featuring a durable stainless steel rod and lightweight plastic body. Its telescopic handle extends up to 33 inches, making it easy to clean without bending. Perfect for bathrooms, kitchens, and other small corners.\n\nLightweight and durable design for effortless cleaning\nHeight-adjustable telescopic stainless steel handle up to 33 inches\nFlexible rubber lip for effective drying and cleaning\nCompact size suitable for tight and hard-to-reach areas\nLong handle ensures easy swipe and reduces strain	202	320.00	15.00	272.00	202	\N	9	f
30	Wall Mounted 3-Compartment Toothbrush Holder - Adhesive Install	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781672030/pgkart/products/i2aoi61tj0ouls7cop4g.webp	Three separate compartments for organized toothbrushes, toothpaste, & small accessories\nWall mount design instantly frees up valuable counter & sink space\nElevates items to maintain superior hygiene & allow for optimal airflow\nEffortless adhesive installation—no tools or drilling required\nOpen design ensures easy access & excellent ventilation\nDurable & practical, ideal for daily use in any bathroom setting	25	99.00	0.00	99.00	25	\N	1	f
35	9009 3-in-1 Lightweight Iron Shower Shelf Rack	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781673887/pgkart/products/yanrkyl2tyud8lcb0gya.webp	Organize your bathroom with the 9009 3-in-1 Shower Shelf Rack, designed for easy storage and handling of all your household items.\n\nLightweight iron construction for durability and portability\nCompact size: 16cm length, 14cm breadth, and 35cm height\nSafe and user-friendly design suitable for home and office use\nSimple to install and convenient to move as needed\nMultipurpose rack ideal for bath accessories and decoration\nCountry Of Origin :- INDIA	10	120.00	2.00	117.60	10	\N	1	f
37	Toothpaste Dispenser & Tooth Brush with Toothbrush	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781674761/pgkart/products/iocp7g8vaejunpbotpe2.webp	Automatic Toothpaste Dispenser & Tooth Brush Holder \n\nThis cute touch n brush auto toothpaste dispenser is designed for detachable clean and hygienic.\n\nAutomatically squeeze toothpaste to ensure appropriate amount of toothpaste, which avoids waste of toothpaste.\n\nThis unique Automatic Toothpaste Dispenser is designed for your convenience, Hygienic and Economy.\n\nIts very performance as one-touch method\n\nIt prevents waste of toothpaste	27	99.00	0.00	99.00	27	\N	1	f
38	Bath Sponge Round Loofah and Back Scrubber for Men and Women	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781675151/pgkart/products/tbebwges56rjlw3l7l1z.webp	Exfoliating with Body Scrubber/loofah is easy; It takes just a few minutes in the shower and can help make your skin smooth and silky soft. Scrub your body with the loofah and rinse your skin with warm water. Easily loosen and remove the top layer of dead skin cells. Body Scrubber/bath sponge is a long lasting scrubber and reaches hard to reach areas of the body while bathing and thus cleans, exfoliates and rejuvenates your skin. Use with your favourite shower soap to create rich lather and remove away impurities leaving behind clean and soft skin. Rinse and air dry after use.	19	20.00	0.00	20.00	19	\N	1	f
6	Over The Door Metal 5 Hook Rack	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781584608/pgkart/products/gu1bhjiyafkykxbhas9e.webp	Over-the-door design for easy installation without drilling\nStrong and durable metal construction for long-lasting use\n5 hooks for efficient organization of multiple items\nSpace-saving solution for small and compact areas\nSleek and modern design suitable for any interior\nSmooth edges to protect clothes and accessories\nLightweight yet sturdy for daily use\nIdeal For :-\nHanging clothes, towels, and accessories\nBedroom and wardrobe organization\nBathroom and kitchen use\nEntryway storage for bags and essentials\nHome and office space organization\nSmall space and apartment living\nSpecifications :-\nProduct Type: Over Door Hook Rack\nMaterial: Metal\nMounting Type: Over Door Hanging\nNumber of Hooks: 5 Hooks\nUsage: Hanging & Storage Organizer\nQuantity: 1 Pc\nColor: Color may vary\nKeywords :-\n\npremium over the door metal 5 hook rack, space saving hanging organizer with strong hooks, metal hook rack for clothes towels and bags, over door storage rack for accessories, durable metal hook organizer for home, bathroom and bedroom use, sturdy hanging hook rack for doors, multipurpose over door hook organizer, convenient wall free storage hook rack, heavy duty 5 hook metal rack, practical door mounted hook organizer, premium metal rack for hanging items\n\nDimension :-\nVolu. Weight (Gm) :- 255\n \nProduct Weight (Gm) :- 96\n \nShip Weight (Gm) :- 255\n \nLength (Cm) :- 34\n \nBreadth (Cm) :- 9\n \nHeight (Cm) :- 4\n\nCountry Of Origin :- China\n	30	99.00	29.00	70.29	30	\N	9	f
7	6 Hook Door Hanger, Steel Coat Rack	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781584805/pgkart/products/bi0rnfrqqfchqrqpn7ei.webp	6 Hook Door Hanger, Steel Coat Rack, Retractable Over The Door Hooks, for Bathroom Bedroom Living Room Kitchen Over The Door Organizer (1 Pc)	20	149.00	0.00	149.00	20	\N	9	f
9	Foldable Mesh Laundry Hamper with Ventilation & Storage Pocket	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781585847/pgkart/products/zv3abpi8naaxouxqyvwy.webp	Keep your laundry organized and fresh with this foldable mesh hamper, designed for optimal ventilation to reduce odors and moisture.\n\nDurable nylon mesh fabric allows air circulation to keep clothes fresh\nEasy to carry with sturdy handles and portable side pocket for extra storage\nLarge interior capacity fits plenty of laundry\nFolds compactly for convenient storage and travel\nPerfect for dorms, apartments, camping, and home use	20	120.00	14.00	103.20	20	\N	1	f
10	Secure 3-Digit Combination Travel Lock for Luggage & Bags	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781586246/pgkart/products/phbi9tme6qxj84wkjeen.webp	Keep your belongings safe with the Secure 3-Digit Combination Travel Lock by Deodap. Perfect for luggage, backpacks, and travel bags, it offers keyless security that's easy to use and reliable for everyday and travel needs.\n\nKeyless 3-digit combination locking system\nEasy to set and reset your personal code\nCompact, lightweight design for convenience\nSmooth locking & unlocking operation\nIdeal for travel, storage & daily security	50	99.00	0.00	99.00	50	\N	9	f
11	Thickened Black Iron Padlock with Brass Core - Waterproof & Anti-Theft	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781586467/pgkart/products/ee3ncn1cyo8cqmsenjhq.webp	Ensure superior security for your home, dormitory, or outdoor spaces with our Thickened Black Iron Padlock. Engineered with a robust brass core and a special anti-oxidation treatment, this lock is built to withstand harsh conditions, providing reliable anti-theft protection without rusting. Its user-friendly design features a smooth locking mechanism and includes three keys for your convenience.	10	129.00	0.00	129.00	10	\N	9	f
12	Mini Plastic Pedal Dustbin - Compact & Lidded for Kitchen, Office, Car	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781586905/pgkart/products/t4dsnvjhjc1cv8jkshsj.webp	Key Features:\n\nOdor-Free Design: Comes with a secure lid to prevent smells from escaping, keeping your environment fresh.\nHands-Free Convenience: The pedal mechanism allows for easy, hygienic opening without touching the bin.\nSpace-Saving: Its minimal design fits effortlessly into narrow openings, under counters, or beside toilets.\nDurable Plastic: Made from high-quality plastic for long-lasting use & easy cleaning.	20	199.00	0.00	199.00	20	\N	9	f
8	Waterproof Printed Canvas Laundry Bag - Foldable & Breathable	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781585681/pgkart/products/cvwbc6np4fuqgdvw2els.webp	Keep your laundry organized and fresh with our Waterproof Printed Canvas Laundry Bag. Made from durable, breathable nylon mesh, this bag allows maximum ventilation to reduce odors. Its large capacity accommodates more laundry, making your chores easier and more efficient.\n\nWaterproof and breathable canvas material\nFoldable and collapsible for easy storage\nConvenient handles for easy carrying\nPortable side pocket for small items\nSturdy workmanship ensures long-lasting use\nPerfect for home organization and laundry tasks	30	130.00	12.00	114.40	30	\N	1	t
31	DeoDap Non-Slip Oval Super Absorbent Bath Mat	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781672594/pgkart/products/teawf67kiwwpzxw168pu.webp	Strong Non-Slip Grip: Rubber base reduces slipping for enhanced safety.\nSuper Absorbent: Velvet fabric quickly absorbs water to maintain dry floors.\nHigh Quality & Durable: Resistant to compression, splashes, and stains.\nMulti-Purpose Use: Perfect for bathroom, kitchen, laundry, or living areas.\nEasy to Clean: Oil resistant and simple to maintain with a brush or sponge	20	149.00	2.00	146.02	20	\N	1	f
34	Shower Shelf Rack – Lightweight 3-in-1 Iron Organizer	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781673772/pgkart/products/nvdfemb6t79arne8qrpu.webp	The Shower Shelf Rack is a versatile 3-in-1 lightweight iron organizer crafted to organize your bathroom efficiently. Designed for durability and easy portability, this rack helps store and hold various bath accessories and household items neatly and conveniently.	19	149.00	0.00	149.00	19	\N	1	f
20	Motivational Water Bottle with Straw & Time Marker - 24cm BPA-Free	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781604911/pgkart/products/lybx7mjjcngzaruoig8w.webp	Stay Hydrated and Motivated with This Portable Water Bottle\n\nKeep track of your daily water intake with the translucent motivational water bottle featuring time markers and inspiring slogans. Perfect for gym sessions, hiking, camping, or everyday use.\n\nMotivational Engraved Slogan & Time Marker: Helps you achieve fitness goals by monitoring hydration throughout the day.\nConvenient One-Handed Use: Flip-up silicone straw opens with a button for easy sipping during workouts.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nCustomers who bought this item also bought\nHome use snack tray with steel cup\nSnack Tray with 350ml Steel Cup for Kids & Home Use\n01_compass\n\nBrand\nCamlin Compass – Durable Metal Body with Yellow Grip\nDesktop punching ball with strong suction spring base\nInflatable Desktop Punching Bag with Air Pump for Reflex Training\nBar End Bike Mirror mounted on bike handlebar showing wide rearview\nBar End Bike Mirror – 360° Rotatable, Foldable, Universal Fit\nAdjustable hand grip exerciser for muscle recovery and strength\nAdjustable Hand Grip Strength Trainer for Muscle Recovery\nkids anti fog goggles\nKids Swim Goggles Leakproof Anti-Fog Eye Protection (1 Pc)\nCar Air Mattress Inflatable Bed with Black Cat Pillow\nCar Air Mattress Set with Black Cat Pillow – Comfortable Travel Bed\nGold medal ribbon award\nGold Finish Winner Medal with Ribbon Strap Award Medal (1 Pc)\nAdjustable Swim Goggles\nKids Anti-Fog Swimming Goggles Comfortable Fit (1 Pc)\nAdjustable Quad Roller Skates for Kids (1 Pair)\n\nBrand\nAdjustable Quad Roller Skates for Kids (1 Pair)\nRecently Viewed Products\nClear All\n\n\n\n\n\n\n\n\n\n	20	199.00	5.00	189.05	20	\N	10	f
21	Stainless Steel Hydra Vacuum Insulated Flask Water Bottle 420ml	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781669914/pgkart/products/ikplnu74iemsa8oyppiy.webp	Keep your drinks fresh and at the right temperature with this premium vacuum insulated flask. Crafted from durable 18/8 stainless steel with a copper coating for superior heat retention, it’s perfect for gym, sports, school, and outdoor activities.\n\nDouble wall insulation maintains temperature for hours\nThreaded lid for secure, easy opening and closing\nRust-resistant stainless steel inside & outside\nPre-condition with hot/cold water for optimal temperature retention\nEasy to clean with mild soap; keep open when not in use to avoid odor	30	219.00	8.00	201.48	30	\N	10	f
22	Mini 3 Layer Drawer 	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781670072/pgkart/products/v5sw9nbblmwyclxzrzkq.webp	It Easily stores the makeup equipments used by ladies through, which they can use those things further. It Is Very Easy to Use and Handle. And Other Than This, It Is Transportable with Simply Designed Structure. It has 3 layer drawer system, which can contain enough makeup equipments easily.	39	249.00	2.00	244.02	39	\N	5	f
23	33 Pc Mini Sewing Kit with Portable Zipper Case for Travel	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781670371/pgkart/products/i54cxedsevnrp863vtpp.webp	Complete set with needles, threads, scissors, buttons & measuring tape\nPortable zipper case perfect for travel and home use\nLightweight design for easy carrying and storage\nIdeal for emergency mending, beginners, and daily repairs	50	149.00	0.00	149.00	50	\N	10	f
24	Portable Sewing Kit Set (1 Set)	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781670470/pgkart/products/rgsveyuxcchntr0t3vu2.webp	Complete sewing kit with threads, needles, and accessories\n\nMultiple color threads for versatile stitching use\n\nCompact and portable design for easy storage\n\nIdeal for quick repairs and minor alterations\n\nOrganized case keeps tools neatly arranged\n\nEasy to use for beginners and daily needs\n\nLightweight and travel-friendly	40	75.00	0.00	75.00	40	\N	10	f
25	4 in 1 Multipurpose Tailoring Sewing Kit with Threads & Needle Threader	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781670549/pgkart/products/wsyqzynwc6g9cotcf2jw.webp	Includes threads in assorted colors and bobbins for versatile stitching\nNeedle threader simplifies threading for easy use\nSafety pins and scissors to assist with various sewing tasks\nCompact size ideal for travel or home use	20	49.00	0.00	49.00	20	\N	10	f
19	Water Bottle 400 ML	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781603846/pgkart/products/ckrkbheggxszrwmjtxaz.webp	outdoor sport water bottle 400ml leak proof BPA-free for travel cold and hot water glass water bottle with daily water intake for gym and children, Nice Bottle (1 pc / Mix Color)\n	20	99.00	0.00	99.00	20	\N	10	f
39	Cute Bunny LED Desk Lamp with Adjustable Neck & USB Charging for Study	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781675408/pgkart/products/yreaytshzqlirlzt6oqx.webp	This cute bunny LED desk lamp is designed to combine functionality with playful décor. Featuring a soft LED light, it provides comfortable illumination that is easy on the eyes, making it ideal for studying, reading, or nighttime use	20	219.00	7.00	203.67	20	\N	2	f
40	LED Study Desk Lamp with Organizer, 3 Color Modes & Adjustable Arm	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781675570/pgkart/products/cjdaujm01et9msowkvcy.webp	Enhance your workspace with this versatile LED Study Desk Lamp featuring an integrated pen stand and organizer for a tidy desk.\n\nThree color modes: white, warm white, and yellow to suit study or relaxation\nAdjustable 360° gooseneck arm to direct light where needed\nBuilt-in pen stand and compartments to keep essentials organized\nEnergy-efficient USB powered LED lighting with low power consumption\nIdeal for students, kids, office, and home use	20	319.00	5.00	303.05	20	\N	2	t
42	Black Gel Pen Set for Kids & School - 8 Pcs	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676024/pgkart/products/um9gmmmwpktvhh4yf1je.webp	Get the perfect writing experience with this Black Gel Pen Set, ideal for kids, school, office, and gift purposes. Designed with non-toxic materials and a smooth ink flow, these pens ensure smudge-free and comfortable writing or designing.	40	48.99	0.00	48.99	40	\N	2	f
71	Pink Multi-Purpose Hanging Organizer with 6 Hooks	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781793947/pgkart/products/tefsw5tgw3nxqasmeqbp.webp	eep your living or workspace clutter-free with this versatile pink hanging organizer featuring 6 sturdy hooks. Designed to hold keys, glasses, utensils, small bags, and more, it offers a compact and practical solution for home, office, or dorm rooms.\n\nDurable pink plastic adds a vibrant look\n6 hooks to hang various items securely\nCompact design fits shelves, doors, or walls\nLightweight and easy to install\nIdeal for decluttering small spaces	30	39.00	0.00	39.00	30	\N	9	f
44	Plastic 5-Compartment Bathroom & Desk Organizer Holder	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676281/pgkart/products/qvmqjp1idkixsebxvesg.webp	Keep your bathroom and office spaces neat with this versatile Plastic 5-Compartment Organizer Holder. Designed to store moisturizers, lotions, scissors, brushes, deodorants, dental floss, razors, makeup, and more.	20	129.00	3.00	125.13	20	\N	2	f
45	Stainless steel large capacity electric kettle (1500W / 1.5 Ltr.)	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676444/pgkart/products/k96yb7jnwilxlsxgnvlh.webp	Description\nHome appliance kitchen stainless steel large capacity electric kettle, Electric Kettle Hot Water Kettle Elegant Design Premium Quality Tea Coffee Warmer (1500W / 1.5 Ltr.)	20	599.00	0.00	599.00	20	\N	3	f
46	Silicone Foldable Collapsible Electric Water Kettle Camping Boiler	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676553/pgkart/products/bovyqx4maoinpkscz6if.webp	Silicone Lightweight Foldable Electric Travel Kettle (Multicolor)\n\nHot Water Anywhere! Start Enjoying Afternoon Tea & Coffee At Any Time! 0.6L Electric Kettle Silicone Foldable Portable Travel Camping Water Boiler Adjustable Voltage Home Electric Appliances Travel Foldable Electric Kettle, Kitli	20	498.98	0.00	498.98	20	\N	3	f
47	Insulated Stainless Steel Coffee & Tea Mug with Spill-Proof Lid	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676636/pgkart/products/puxpbbmnkaa4jnxrdtj5.webp	Keep your favorite drinks perfectly hot or refreshingly cold for hours with our premium Insulated Stainless Steel Coffee & Tea Mug. Designed for ultimate convenience whether you're at the office, home, or on the go, this durable mug features a secure, spill-proof lid with a silicone seal to lock in temperature and prevent leaks.	26	99.00	0.00	99.00	26	\N	3	f
48	Pink Plastic Water Bottle with Carry Strap - 400ML	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676734/pgkart/products/rse7gvapiak4wfn4dc5p.webp	Stay hydrated on the go with this stylish Pink Plastic Water Bottle, featuring a convenient carry strap for easy transport.\n\nDurable, BPA-free plastic ensures safe everyday use.\n400ML capacity ideal for water, juice, tea, or coffee.\nLeak-proof screw lid prevents spills during travel.\nLightweight and compact, perfect for school, office, gym, and outdoor activities.\nEco-friendly and reusable alternative to disposable bottles.	30	79.00	0.00	79.00	30	\N	3	t
49	Apex Glory 4-Pc Plastic Airtight Storage Containers Set 	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676920/pgkart/products/n4wrsupkgjydhn8qzovb.webp	Keep your kitchen organized and food fresh with the Apex Glory 4-piece plastic storage container set. Designed for multipurpose use, these BPA-free containers are perfect for storing dry goods like cereals, grains, snacks & pulses.\n\nSet of 4 assorted size containers with airtight blue lids\nDurable, BPA-free, food-safe plastic for safe storage\nTransparent rectangular design for easy content viewing and space-saving stacking\nIdeal for kitchen pantry organization and maintaining food freshness\nEasy to clean and reusable for long-term use	20	99.00	0.00	99.00	20	\N	3	f
50	4-Piece Airtight Plastic Storage Container Set for Snacks	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676984/pgkart/products/yweksdbjb5gmttew4rnn.webp	Keep your kitchen organized with this 4-piece multipurpose plastic storage container set. Ideal for storing dry fruits, spices, cookies, chocolates, and snacks, each container features a secure airtight lid to maintain freshness.\n\nMulti-compartment design to separate different snacks\nTransparent containers for easy content identification\nStylish and modern design suitable for serving guests\nEasy to clean and maintain\nDurable plastic material for daily use	20	99.00	0.00	99.00	20	\N	3	f
51	Plastic Food Storage Containers Set of 3 with Removable Drain Tray & Lid	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781677181/pgkart/products/y0jgswhzhtmvzpmtbshr.webp	Keep your fridge organized and food fresher with this 3-piece set of plastic food storage containers from Organivo. Made of lightweight, durable PP plastic, these stackable containers feature a removable drain tray that lifts food above the bottom to drain excess liquids and reduce contamination.\n\nSet includes 3 stackable containers with airtight lids\nRemovable drain tray keeps fruits, vegetables, meat, & more fresh\nClear design for easy visibility of contents\nEasy to clean and perfect for defrosting, marinating & storage\nDimensions: 23cm (L) x 11cm (W) x 23cm (H)\nIdeal for organizing your refrigerator while maintaining freshness and hygiene. Great for meats, seafood, produce, and leftovers.\n\nCountry Of Origin :- India\n\nGST :- 18%\n\nExplore This Also\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nCustomers who bought this item also bought\n3 Pc Set Kitchen Tool Kit – Wine Bottle Opener, Knife, and Scissors Set\nTop-Grab\n3 Pc Set Kitchen Tool Kit – Wine Bottle Opener, Knife, and Scissors Set\nWall Mount 6-Layer Food Storage Rack – Stackable, Space-Saving Organizer\nWall Mount 6-Layer Food Storage Rack – Stackable, Space-Saving Organizer\nWall mounted spice rack\nWall Mounted Spice Rack Organizer with Adhesive Stick Holder (1 Pc)\nPlastic roller puri maker\nTop-Grab\nMultipurpose Dough Cutter Roller Tool for Baking & Puri Making (1pc)\nShivling tabletop water fountain with LED crystal ball glowing at night\nShivling Tabletop Water Fountain with LED Crystal Ball\nEco-friendly plastic bowl rack for kitchen organization\nPlastic Bowl Holder Organizer & Drain Rack for Kitchen (1 Pc)\nTumbler and toothbrush holder set, 2 pcs, compact design\n2-in-1 Tumbler Dish & Toothbrush Holder (2-Pcs)\nWall-mounted toothbrush holder rack with 4 cute cartoon rinse cups\nToothbrush Holder & Storage Rack with 4 Cute Cartoon Cups\nWooden Decorative Cutouts\nWooden Decorative Cutouts (Mix Design / 4 Pc)\nNoVibe Pads set of 4 for washing machines\nPlastic Washing Machine Feet Pads Set of 4 – Anti Vibration & Noise Cancelling\nRecently Viewed Products\nClear All\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDownload our app\nGoogle Play\nApp Store\n1Cr+ Downloads\n\n4.2 Star Rated\n\n73.4k Reviews\n\nLogo\nSpend Less, Get Best\n\nGet it on Google Play\nDownload on the App Store\nFOLLOW US :\nFacebook\nFacebook\nLinkedIn\nLinkedin\nsnapchat\nSnapchat\nwhatsapp\nWhatsapp\nyoutube\nYouTube\nDabster International Private Limited\n\nGST : 24AAHCD5265C1ZX\n\nCIN : U51909GJ2019PTC110919\n\nCopyright © 2019–2026 DeoDap.\n\nQUICK LINKS\nWhat Is Dropshipping\nDropshipping\nFranchise\nBecome Vendor\nCreate a Ticket\nWholesale login\nWholesale Signup\nVIP Customers\nPOLICIES\nAbout Us\nContact Us\nTerms & Conditions\nShipping Policy\nReturn and Refund Policy\nPayment & Security\nPrivacy Policy\nOrder Cancellation Policy\nGrievance Redressal Policy\nOTHER LINKS\nInfluencer Form\nBlogs\nDMCA\nAffiliate\nFAQs\nCareer\nShipment Tracking\nStore Locator\nDROP SHIPPING WITH DEODAP\nDeoDap Dropshipping\nAll Website Plan\nShopify Website\nSelf Serve Plan\nB2B Drop Shipping\nReseller Plan\nTrade India \nTrade India \nGoogle Review \nMouthshut Reviews\nAmazon Reviews\n\nProduct image\nPlastic Food Storage Containers Set of 3 with Removable Drain Tray & Lid\n\n	19	198.99	0.00	198.99	19	\N	3	f
43	Refillable Black Marker Pen Set with 20 Pens & Extra Ink	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781676144/pgkart/products/ililonkqqicf0bzwf7xz.webp	This set is perfect for smooth, bold writing with durable, refillable pens ideal for office, school, college, teaching, and home use.\n\nRefillable design for long-lasting use\nConsistent bold black ink for clear writing\nStrong, durable pen body built for extended sessions\nIncludes 20 pens plus refill ink sticks for cost-effectiveness\nPerfect for paper, notebooks, registers & documents\nEasy ink refill system reduces waste\nIdeal for both professional and daily use	20	149.00	0.00	149.00	20	\N	2	t
52	Premium 25-Piece Stainless Steel Cutlery Set with Revolving Stand	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781677497/pgkart/products/ku5w1pa5kfcvkuz0uwd8.webp	Transform your dining experience with this elegant 25-piece stainless steel cutlery set, designed for both style and convenience. Crafted from high-quality, rust-resistant stainless steel, this set promises lasting durability and a luxurious mirror finish that brightens any table setting. The innovative 360° revolving stand keeps your spoons and forks perfectly organized and within easy reach, making meal prep and cleanup a breeze.\n\nPremium Stainless Steel: Made from 100% high-quality, rust-resistant material for long-lasting use.\nComplete 25-Piece Set: Includes a balanced mix of spoons and forks, ideal for families and entertaining.\n360° Revolving Stand: Ensures easy access and keeps your cutlery neatly organized on the countertop.\nMirror Finish Design: Adds a touch of luxury and sophistication to your dining table.\n	20	499.00	4.00	479.04	20	\N	3	f
53	Dry Fruit & Snack Organizer: 360° Revolving Box (7 Compartments, Airtight)	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781677779/pgkart/products/blveh2sdllpeooejnhgt.webp	60° Revolving Spice Box & Dry Fruit Box Plastic 7 Compartment Box Suitable For Multipurpose Storage Use like Dry Fruit, Spices, Pickle, Tea, & Sugar Etc, Kitchen Use \n	20	199.00	10.00	179.10	20	\N	3	f
72	Eco-Friendly Reusable Lint Roller for Clothes & Pet Hair	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781794049/pgkart/products/acvya8wempwsozc59eje.webp	Tired of lint, dust, and pet hair clinging to your clothes and furniture? Discover the Eco-Friendly Reusable Lint Roller – your sustainable solution for a spotless home and wardrobe! This innovative roller effortlessly captures unwanted debris, keeping your fabrics looking fresh and clean. Perfect for quick touch-ups or thorough cleaning, its compact design makes it an essential tool for every household, office, and car.	20	79.00	8.00	72.68	20	\N	9	f
55	Stainless Steel Vacuum Insulated Coffee Flask with Flip Lock Lid (400ML / 1 Pc)	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781678284/pgkart/products/ltmpyn4ycg5gnhdo0iuy.webp	Premium 400 ML Stainless Steel Vacuum Insulated Coffee Flask with Flip Lock Lid – Double Wall Travel Mug for Hot & Cold Beverages – Spill-Proof and Portable Café Style Thermos Cup	20	299.00	7.00	278.07	20	\N	3	f
56	3-Layer Transparent Drawer Storage Organizer with Smooth Pull-Out Bins	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781683717/pgkart/products/qu1t0d1349tajmn06hbo.webp	Organize your space efficiently with the 3-Layer Transparent Drawer Storage Organizer from DeoDap. This free-standing chest features three spacious, smooth sliding drawers with clear fronts for quick visibility of contents, perfect for home, office, or kids’ rooms.\n\nThree deep pull-out drawers offering generous storage capacity\nTransparent fronts for easy content identification\nSturdy, wobble-resistant frame with floor-friendly feet\nFlat top surface doubles as extra shelf space\nModular design allows multiple units to be combined\nEasy to clean and maintain with removable drawers	10	599.00	0.00	599.00	10	\N	5	f
1	Rechargeable LED Desk Lamp with Pen Stand, Foldable Study Table Light	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781431248/pgkart/products/gwrabxm7yqll6e2jkkpb.webp	This rechargeable LED desk lamp is designed for everyday study, work, and reading needs. The foldable structure allows easy angle adjustment while saving desk space. It comes with a built-in pen holder to keep your workspace organized. The LED light provides comfortable illumination suitable for long hours without strain. Ideal for students, home offices, bedrooms, and work desks.	20	299.00	17.00	248.17	20	\N	2	t
57	Multi-Purpose Cable Clips and Wire Organizer for Desk and Table	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781683874/pgkart/products/ddxysksg95o8ahzqpinz.webp	Tidy your space – These convenient adhesive cable clips keep your desk, home, or car uncluttered and organized; perfect neat and safe cable organizer solution, helps you find cables and cords easily\n\nSuperior design – Cable cord organizer set includes 5 different sizes, fits small diameter cords like phone chargers or mouse cords, or larger diameter power cables, connectors, speaker wires\n\nEasy to stick on – Strong adhesive bonds with most surfaces, including plastic, metal, glass, wood, rubber, walls, car interiors, more; no tools required for these adhesive clips for organizing cables\n\nDesigned to last – Ultimate high performance cord organizers, made from sturdy silicone rubber material with superb adhesive; high quality cable clips built to professional equipment standards\n	20	49.00	5.00	46.55	20	\N	5	f
58	3-Layer Multipurpose Kitchen Storage Basket Rack - Ventilated Organizer	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781684723/pgkart/products/wrybmm0cqmx3uarll3xx.webp	Keep your kitchen and pantry tidy with this 3-layer multipurpose storage basket rack. Its ventilated, open baskets allow fresh air circulation to keep fruits and vegetables fresher longer. The sturdy plastic construction with high-strength pillars ensures a stable, wobble-free stand.\n\nThree spacious ventilated baskets for produce & pantry items\nTool-free push-fit assembly for quick setup & easy relocation\nRaised base and smooth edges for safety and moisture resistance\nLightweight yet durable plastic ideal for everyday use\nMulti-position design: use as a full rack or separate baskets\nPerfect for kitchen, bathroom, office, or retail display	20	249.00	5.00	236.55	20	\N	5	f
54	Multipurpose 7-Compartment Dry Fruit & Snack Storage Box	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781677885/pgkart/products/jjiy2ez8g8rzjhabx1yb.webp	Traditional look serve ware dry fruits box for modern homes. It's stylish outlook and compartment make it beautiful This tray set is designed in a special way to enhance your dining table. The body of the tray set is well designed. The tray gives a amazing look in the drawing room or dining table. Ideal for daily use and gifting. Stylish and trendy look, food safe and durable. Embossed graphics create luster and classic gaze. This Box has four section where in you can easily arrange Dry Fruits, Chocolate, Mouth Freshener, Sweet. Antique design Dry Fruit Mukhvas Box Mouth Refreshment Box.\n	26	199.00	5.00	189.05	26	\N	3	t
59	Multipurpose Smart Shelf Basket Storage Basket (Set 3 Pc)	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781684964/pgkart/products/axtlavo6iyjb0xq3qhtf.webp	DeoDap Kitchen Storage - Smart Baskets for Storage, Set of 3, Sky Blue\n\nSafe Storage Solution\n\nSmart Kitchen Baskets are made from polypropylene, which is high-quality food-grade plastic, and thus safe for daily usage. These baskets weigh in the range of 93 gms to 220 gms and serve as optimum storage solutions with their heavy grade plastic.\n\nOrganized Appearance\n\nUse these baskets for storing away fruits, vegetables and other non-perishable solids. It will make your kitchen look systematic, and all these goods will be easily accessible as they are stored in one place.\n\nFirm Grip\n\nStyled in a woven pattern, these baskets offer good holding grip and give a distinctive look to your kitchen. They are easy to store in your kitchen or dining room with their sleek design. The blue shade of the baskets gives them a contemporary look and finish.	20	149.00	4.00	143.04	20	\N	5	f
60	Multi-Function 10-Grid Drawer Storage Box Set - 2 Pieces	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781685286/pgkart/products/tv7ccvehxrwvgqufwqhv.webp	Organize your wardrobe and drawers effortlessly with this Multi-Function 10-Grid Drawer Storage Box Set (2 pieces). Crafted to keep your underwear, socks, ties, and small items neat and accessible, it fits perfectly in closets, dressers, or under the bed.\n\n10-grid compartments to separate and organize efficiently\nDurable, high-quality material ensures long-term use\nSpace-saving design enhances any drawer or shelf\nMultipurpose: ideal for underwear, socks, bras, ties & more\nFits easily in various home spaces like bedroom, bathroom & study\nKeep your essentials tidy and your home decor stylish with these versatile organizer boxes.	20	149.00	5.00	141.55	20	\N	5	f
61	Extension Board 220V 10 Way Extension Board	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781791924/pgkart/products/trexuwyplyjym9eemclm.webp	Durable & Ergonomic design\n10 Universal sockets with Master Switch\nLong Heavy duty wire\nLED Indication for power status\nRobust inbuilt surge protection, Adequate spacing between sockets to accommodate	20	179.00	10.00	161.10	20	\N	8	f
62	Mini Handheld Rechargeable USB Fan with Stand - Portable Desk Fan	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781792133/pgkart/products/mzodrvljsyzusim19nis.webp	Why You'll Love It:\nUltra-Portable Design: Compact enough to hold in one hand or slip into your bag or pocket.\nRechargeable & Cordless: Built-in USB rechargeable battery with included cable for eco-friendly use.\nHands-Free Convenience: Detachable stand allows for stable desktop use while you work or relax.\nEffortless Operation: Simple one-touch power button for instant cooling.\nSafe & Effective: Delivers a strong, refreshing airflow with soft, safe rotating blades.\nVersatile Use: Ideal for home, office, travel, outdoor events, and daily commutes.	20	149.00	5.00	141.55	20	\N	8	f
63	65W USB-A to Type-C Braided Fast Charging Cable with Mobile Stand	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781792250/pgkart/products/twszdb74hrgapd63xnex.webp	Experience rapid charging & seamless data transfer with the 65W USB-A to Type-C Braided Charging Cable. Designed for durability & convenience, this 1-meter cable ensures your devices are always powered up & ready. Its robust braided construction resists tangles & wear, making it perfect for daily use at home, the office, or while traveling.\n\nAs an added bonus, this cable comes with a handy mobile stand, allowing you to prop up your smartphone or tablet for hands-free viewing while it charges. Enjoy stable performance & a flexible, strong build that stands the test of time.\n\nFast 65W Power Delivery: Quick-charge your compatible Type-C devices.\nDurable Braided Design: Enhanced longevity & tangle-free use.\nIntegrated Mobile Stand: Convenient hands-free viewing while charging.\n1-Meter Length: Optimal reach for versatile charging setups.\nReliable Data Sync: Transfer files swiftly & securely.	20	99.00	0.00	99.00	20	\N	8	f
68	Premium Wired Earphones with 3.5mm Jack & Built-In Mic	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781793205/pgkart/products/pzhcb1w4zbuqfwp4fod2.webp	Experience crystal-clear stereo sound with these premium wired earphones, designed for all-day comfort and durability. Enjoy seamless hands-free calls with the built-in microphone and an ergonomic in-ear fit that stays comfortable during extended use.	20	49.00	0.00	49.00	20	\N	8	f
65	Motorcycle Phone Mount Bicycle Phone Holder Motorcycle Handlebar Phone Holder	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781792443/pgkart/products/dduvri8slytfvzynr92n.webp	One-handed operation, this motorcycle/bike phone holder is equipped with a quick release mounting base, which is very convenient to install on your bike/motorcycle handlebars.\n\nWith one-button locking and quick-release design, you can quickly put in or take out your phone with one hand and one second, allowing you to enjoy the freedom of riding.\n\nThe bike motorcycle phone holder is made of ABS, which is light and durable, giving you an innovative feeling.\n\nThe phone holder can be adjusted flexibly, and the swivel joint allows the phone to rotate 360°, which can be adjusted to your preferred position.\n\nThe bike phone holder can be easily installed on your bike handlebars without any tools, very simple.\n	25	99.00	10.00	89.10	25	\N	8	f
64	Multi-Purpose Yellow Wall Holder Stand for Mobile Charging	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781792334/pgkart/products/nfjudhfxl5yamhkggodb.webp	Charging Stand/Mobile Holder made up of superior quality ABS material. Best suitable for mobile phone charging.\n\nIt has a shining finish, which enhances its looks. Open slots on the holder give better ventilation effect during charging the phone. Three pins on the lever give fixed support to the holder/stand.\n\nA smartphone wall holder can give your phone a safe dock while charging. This makes a good grip at the stand charging point. Better foldable design.\n\nVery easy to install; No tool is needed to install it Just Fix and Charge Your Device Like Phone, Power Bank, Camera	18	79.00	0.00	79.00	18	\N	8	t
66	Metallic Spiral Cable Protector for Cords & Headphones	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781792780/pgkart/products/jbu8ek5euhnx9jlf2vzi.webp	Protect your cables and headphones with the sleek Metallic Spiral Cable Protector. Designed to prevent twists, bends, frays, and pet damage, this durable cable wrap is perfect for Lightning, USB, and headphone cords.	100	30.00	0.00	30.00	100	\N	8	f
67	Spiral Cable Protector for Chargers – 10-Pack Flexible Silicone	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781792864/pgkart/products/p3td7myolib0h5oje44s.webp	Protect your charging and data cables from wear and tear with the Spiral Charger Cable Protector. Made from flexible silicone, it fits all types of cables including phone chargers, headphone cords, and USB cables for devices like smartphones, laptops, and tablets.	100	30.00	0.00	30.00	100	\N	8	f
3	 Cloth Hanger | Stainless Steel (12 pcs)	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781583408/pgkart/products/d3exyrqiqdqude3bx1gm.webp	Cloths Hangers 12pcs Plastic Hangers (Pack of 12 Pcs)\n\nEasily Hang up Everything from Delicate Blouses to Full Suits, our Black Hangers\n\nThis pack of 12 Velvet Hangers are not only durable and lightweight, but also feature a non-slip attribute that holds clothes in place without falling or sagging. The slim design of the hangers allows you to maximize space in your closet. Get a neat, organized closet with these uniform Ivory Velvet hangers, Steel Hanger.\n\n360 Degree Rotate Feature for Better Usage\nThe hooks of these hangers are sturdily designed with 360 degree rotate feature to provide great ease of use. It allows you to easily rotate the hook as required in order to manage your wardrobe in a proficient manner.\n\nClothes Hangers\nDurable\nPack of 12\nNon Slip\n\nThe one product you need in a household closet to stay organized are hangers. You can store practically anything on them; pants, skirts, dresses, jackets, coats, slacks, pajamas, sweatpants, scarves, pashminas, ties, jeans, tuxedos, suits, dresses the list never ends.\n\nprovides a variety of medium weight, heavy weight hangers. They come in several variations including different weights, different colors and quantities.\n\nSlim and Sleek Design: These hangers will allow you to maximize space in your closet while keeping your clothes securely in place and consistently organized. The durable and sturdy design is able to comfortably hold clothes up to 8 ibs.\n\nFeatures:\n\nTake Care Of Your Clothes-Made from eco-friendly plastic, our plastic adult hangers do not have burrs or flash, different from other tubular hangers. Unlike the metal hangers, there are no sharp edges to put unwanted creases or leave marks in the shoulders of your clothes\nSimple Smooth Line Design-Best part is that the straight line tubular hangers do not have annoying notches, which would not snag and ruin the shirts when you put them on or off the hangers. However, the plastic clothes hangers have small hooks on the lower outer corners, good for hanging dresses, tops, lingerie with straps like spaghetti straps\nThese adult hangers are super heavy weight high impact tubular clothes hangers made to last for years. For our regular heavy weight or other medium weight options\nSturdy and durable - This ultra strong velvet hangers are made of high grade plastic and 360-degree swivel hook, hold up to 10 ibs\nNon-slip ivory velvet design with chrome finish ensures secure hanging of your clothes with slim and sleek construction to maximize space in your closet\n\nDimension :-\n\nVolu. Weight (Gm) :- 420\n \nProduct Weight (Gm) :- 376\n \nShip Weight (Gm) :- 420\n \nLength (Cm) :- 38\n \nBreadth (Cm) :- 18\n \nHeight (Cm) :- 3	20	149.00	10.00	134.10	20	\N	9	t
69	Multipurpose Anti-Slip Cutting Board 36x23 cm with Handle	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781793679/pgkart/products/ufl6enylejbvejn2tupm.webp	Upgrade your kitchen with this durable, multipurpose cutting board designed for safe and efficient food prep.\n\nDurable and sturdy construction for lasting use\nAnti-slip base ensures stable cutting surface\nSmooth surface is easy to clean and maintain\nConvenient handle for easy grip and hanging storage\nLightweight and ideal for fruits, vegetables, and more\nPerfect for home kitchens and professional settings	20	129.00	5.00	122.55	20	\N	3	f
70	Portable 4-Blade Mini Grinder & Blender for Coffee, Spices & More	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781793831/pgkart/products/qhovmfkgouzx1wusa8cs.webp	Elevate your daily routine with the Portable 4-Blade Mini Grinder & Blender. This versatile electric mixer is engineered for efficiency and convenience, perfect for both your kitchen countertop and office pantry. Enjoy freshly ground coffee, perfectly blended spices, and more with unparalleled ease.\n\nPowerful & Precise: Equipped with durable, corrosion-resistant stainless steel blades, it ensures even particle size for superior flavor extraction, whether you're grinding coffee beans or processing spices.\nMonitor Your Grind: The transparent lid allows you to easily observe the grinding process, giving you full control over achieving your desired fine or coarse consistency.\nCompact & Quiet: Designed with a low-noise motor, this mini appliance operates discreetly, making it ideal for peaceful mornings or busy office environments without disturbance.\nMulti-Functional Marvel: Beyond coffee beans, effortlessly grind grains, beans, seasonings, nuts, rice, yam, rock sugar, corn, and dry pepper. A true all-in-one solution for your culinary needs.\nBuilt to Last: Crafted from non-toxic, high-quality materials, this grinder & blender is built for longevity and reliable performance, day after day.	10	399.00	0.00	399.00	10	\N	3	t
5	Over The Door Hanger Rack 7 Hooks Decorative Ognazier Hook (1 Pc)	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781584432/pgkart/products/ast535zqprneod76kwfc.webp	Though full and Safety : From the top of the door to the bottom curve of the hooks., available for kids and women to reach, and round top can pevent accident scratch, care every users safety.\n Functional and Stylish : This 7 hook hanger rack provide you a instant organizing for your closet and room, it is place-saveing and decorate with a classic retro craftsmanship give us a vintage feeling.\nWidely Used : With the retro and elegant partern in the hanger it perfect for home(bedroom, bathroom, dinning room, cabinet, doorway, hallway... ), office, themed restaurant, hotel and more. The 7 hooks with round ends, you can put your keys, hats, scarves, coats, bags adn more.\nSturdy and High Quality : The over door hooks is made of metal material, treated with special retro black coating, combined with the superb craftsmanship, keeps the hook from staining or rusting for a long term use and make it more stable.\nOverdoor Organizer Rack - Over the Door Hooks are perfect for anyone who needs more hanging space for almost anything.The hooks are round with smooth ends plus a high-quality finish that leaves your items with no tears or scratches\nUser-friendliness Storage Holder - The holders are ready for use and you dona need to pay for installation.You could just adjust the hooks upright vertically since the door hanger hook is flexible to some degree due to the deformation during transportation process.\nSturdy Waterproof,Rustproof,Anti-corrosion Organizer - Made of durable stainless steel, these hooks let you hang items securely without any sort of adhesives\n\nDimension:-\n\nVolu. Weight (Gm) :- 850\n\nProduct Weight (Gm) :- 170\n\nShip Weight (Gm) :- 850\n\nLength (Cm) :- 40\n\nBreadth (Cm) :- 21\n\nHeight (Cm) :- 5\n\n	19	179.00	10.00	161.10	19	\N	9	t
73	Multi Hook Hanger Organizer for Keys, Belts & Accessories	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781794123/pgkart/products/qmqhn1djw6ermg9lsfz4.webp	Keep your essentials tidy and accessible with this versatile multi hook hanger. Designed to hold keys, belts, caps, and accessories, it helps you stay organized in any space.\n\nMultiple sturdy hooks for versatile storage\nDurable build for everyday use\nCompact design saves space\nEasy to hang on rods, doors, or racks\nPerfect for home, office, or wardrobe organization\nEnjoy a clutter-free space and quick access to your essentials with this practical organizer.	24	49.00	0.00	49.00	24	\N	9	f
74	Ear & Nose Hair Trimmer – Painless, Battery-Operated | Calm & Curl	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781957908/pgkart/products/qclnwjy7cqdjqcpfx1dh.webp	Experience effortless and precise grooming with our premium Ear & Nose Hair Trimmer from Calm & Curl. Designed specifically for the delicate areas of your ears and nose, this advanced battery-operated trimmer offers a gentle yet highly effective solution for managing unwanted hair. Achieve a clean, well-groomed appearance without the discomfort often associated with traditional methods. Its ergonomic design ensures a comfortable grip, making your grooming routine quick, safe, and entirely painless. Elevate your personal care regimen with this essential tool, crafted for the modern Indian individual seeking convenience and impeccable results.	20	99.00	10.00	89.10	20	\N	1	f
41	Sticky Notes 100 Sheets 3x3 Inch for Quick Reminders	https://res.cloudinary.com/drzdoi3rp/image/upload/v1781675906/pgkart/products/djvry4iwcrc5ct8ii5tw.webp	Keep your thoughts organized with DeoDap Sticky Notes, featuring 100 sheets in a compact 3x3 inch square format. Ideal for quick notes, reminders, and daily planning at work, school, or home.\n\n100 sheets per pad for ample note-taking\nEasy-to-use adhesive backing for repositioning without residue\nSmooth surface perfect for writing with pens and markers\nCompact square size fits perfectly on desks, planners, and notebooks\nGreat for office, study, and home organization	48	20.00	0.00	20.00	48	\N	2	f
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (role_id, role_name) FROM stdin;
1	ROLE_USER
2	ROLE_ADMIN
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	2
1	1
2	2
2	1
3	1
4	1
6	1
7	1
8	1
9	1
10	1
11	1
12	1
13	1
14	1
15	1
16	1
17	1
18	1
19	1
20	1
21	1
22	1
23	1
24	1
25	1
26	1
27	1
28	1
29	1
30	1
31	1
32	1
33	1
34	1
35	1
36	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (user_id, username, email, password) FROM stdin;
1	pgkart_admin	pgkart_admin@pgkart.in	$2a$12$D0P/kj5EHAyRGxSYxuIm.OdtFEjv6xGZhp6lk1MOfZBwy3gOI1EgC
3	user1	user1@pgkart.in	$2a$12$Uxc8evuKUam0X6sZGrx6/.NleazrkqsVaPNPMExt8EjNgTWWitiEC
2	admin	admin_demo@pgkart.in	$2b$10$zIl3s1eXcQG4etEENIyvJ.m.SaX.Kr9Rexmxp3jjcCNBVXXJnYt9S
6	anshrajshukla546_44780	anshrajshukla546@gmail.com	$2a$12$PYoGyjFYwI8NzbCCPz4Bi.e3MJDMobit79N2BzWIqe07b2nFNTHQG
4	anshrajshukla1	anshrajshukla.official@gmail.com	$2a$12$9KOHlBPY5uSXBhIaSNzb6uQmkNArRmlgO64apYQ5Vt3aRKKtO5MNe
7	atulkr141005_686a7	atulkr141005@gmail.com	$2a$12$o3tHM/0hWSA/m18odnszbu0CRIeur2Ozgpe8Mm.pBkiW78ZYRE8Oa
8	vaishnavi	vaishtyagi123@gmail.com	$2a$12$YVvpnERZljgUGEhUtUoR1.PH9pWIv1h9DdG6X/y7oZuOLcDPXyDri
9	ayoub_sky1833	mailerayoubghailan@gmail.com	$2a$12$3kcUdju1YuaBDUKq3WE3UOPF9ztCn.XY6xomNbmpiJwzhR43ld3Ym
10	udhay.nayyar01_402d3	udhay.nayyar01@sarasai.org	$2a$12$.AIDNYVHQTwSR2.nyEQBdutRRbWiNdz2XQDm4upGHlOskKlpdzSDC
11	aditishukla29700_1a08f	aditishukla29700@gmail.com	$2a$12$sRsj1BLDudQBkBOhNd.qT.dllfpqOeyEfBbOFDBHE/3dccQagRG1C
12	ayushshukla8920_a910d	ayushshukla8920@gmail.com	$2a$12$sJZnD40u9QWBmDPDtJ1u.u0ut7uHhSmWnyKHO7BzrSlagQeImmeLa
13	ayushmishr99119_9d8ed	ayushmishr99119@gmail.com	$2a$12$4HA0xfrOkJEO38diXBKFb.1BM2mvWZDc0zDBs6BJjevdXKqTFkm7G
14	rajayushrajesh1975@gmail.com	rajayushrajesh1975@gmail.com	$2a$12$0FIMUwsB.dkYmUU4UWghfOmSGo/NwotOG9ktYEQ.SdR/XgvWcoeZ6
15	macwithayush99@gmail.com	macwithayush99@gmail.com	$2a$12$uzftNXeu1kRBTpa6E4G9J.MlfOEcIYj1rJAnLMCxNf/yD.fF/bv9y
16	ayushmishra991199@gmail.com	ayushmishra991199@gmail.com	$2a$12$2w5vdVdbYH2WxXz34RqH5.4xw/k0ufscaqG9j6MiAPrA0uqMIvBBS
17	jharaushan423@gmail.com	jharaushan423@gmail.com	$2a$12$HzhIQtlpczC5pIqwyjMot.i.QGGOZW45UQOzg.rrF/st3SwlbpYAe
18	michaelboom301@gmail.com	michaelboom301@gmail.com	$2a$12$MxX/Xwe9wRBbFbPfkSyFtOiZeY5pYTKEHXoGn2HgDk/JtJ6m1UpZS
19	biggru541@gmail.com	biggru541@gmail.com	$2a$12$BnSwmhykLgQFrA.4XY99dOM7CvHc/kGrT.D.HHVrZzroYLPozVHb6
20	sonu.nahar007@gmail.com	sonu.nahar007@gmail.com	$2a$12$nGf1gKgu71Nuor9rWeSBheV71ZcZNiy4rAXiUp8finL/vMTEGLAhS
21	mohitjangidworks@gmail.com	mohitjangidworks@gmail.com	$2a$12$4V.H1B94SuupHTPlf2BR9.0wOUpF6NqAEeJ7GJFwQzngHpccL0n.S
22	amitdole3333@gmail.com	amitdole3333@gmail.com	$2a$12$09v5Z3CD6GZNScjGt3OUlOUCkdiEQxENAXzBr5TuRZYYgHI95.Y5e
23	guhanchinu@gmail.com	guhanchinu@gmail.com	$2a$12$zVxwJ2PBo15FAltUN5gkJOREW0OiczITL3J9pdtORT36ne4.t32v2
24	Abc	abc@gmail.com	$2a$12$TaRjncTEnhsf46LSTHntnOIGWKth3Od/hU8dAiKIiqForbAna6VSe
25	awadhkishorsingh241@gmail.com	awadhkishorsingh241@gmail.com	$2a$12$Te5pQygyGGIDphVHCd0Q9.AevQ5Vh13cagJCNwtj2hCQ.Ob3P2JA6
26	Alok Gupta	alokg7055@gmail.com	$2a$12$hgC4Y.9mix7Z/u5U2eKcveEUlgBjkh3w3d9T9lHr1DJ02jtTemI3q
27	rupikakumari2001@gmail.com	rupikakumari2001@gmail.com	$2a$12$vgbwYQy.2kgP1hsJ0L9Rw.36.WpJz/KQn4xyjyzEdYyOH/D9my.BC
28	niraj.roy.sot2428@pwioi.com	niraj.roy.sot2428@pwioi.com	$2a$12$M9AuOgdU0/kWIT.HV34WPOLNR2.YT9mtcWunq3RUM7ro86ElrP4Ci
30	lokendras49450@gmail.com	lokendras49450@gmail.com	$2a$12$ZVA.PrhocF/xbd3gj/HUNuf6rBU8EsOvAhwymy8MLldpdT0RxJS9a
31	Jigyasa	jigyasa904@gmail.com	$2a$12$h1X5RwKncsV0qbRX5oKWQuXcL3N4gOThrOhnDP6cOFqDC1gO838ue
32	bhavishyalucky@gmail.com	bhavishyalucky@gmail.com	$2a$12$WrETory/msIoYi5yBAuno.kmkkMHC2nz6KLKSPY.geaPA88iPyZC6
33	sumitsinghyadav097@gmail.com	sumitsinghyadav097@gmail.com	$2a$12$PXnp/JU3xce7dmHiWIFUi.kMo9SjSVDdMYoAijNf.f56ah4X2wqLK
34	vvaradhan3107@gmail.com	vvaradhan3107@gmail.com	$2a$12$qCHHK4ocijuSsq3N9rboKO.fHzxQgg.c00fTZc3.WF7Asb9zRV.4m
35	Akanksha 	akankshaprath@gmail.com	$2a$12$TUf6Jmn.KF56YaPQedj1AukjeNgpaTPwHRhKXbeGLv6Zt2Dtaqh8m
29	udayreddykeesari2@gmail.com	udayreddykeesari2@gmail.com	$2a$12$MqJf2I0OAEF5kWtQ0CGIf.iHRqSjExZJLRXyeyvfvf/udt9VRpLMm
36	devishipandey6@gmail.com	devishipandey6@gmail.com	$2a$12$Tn7P7/F4B2m.mdjerr2hGeKzkq.voA1tucVJTjzMzTy1N8XgOjgUK
\.


--
-- Name: addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.addresses_address_id_seq', 53, true);


--
-- Name: cart_items_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cart_items_cart_item_id_seq', 84, true);


--
-- Name: carts_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.carts_cart_id_seq', 30, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 10, true);


--
-- Name: coupons_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.coupons_coupon_id_seq', 2, true);


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 24, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 23, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 9, true);


--
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 23, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.products_product_id_seq', 74, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 4, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_user_id_seq', 36, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (coupon_id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_cart_items_cart; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_cart_items_cart ON public.cart_items USING btree (cart_id);


--
-- Name: idx_orders_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_orders_email ON public.orders USING btree (email);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_orders_status ON public.orders USING btree (order_status);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(cart_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: orders orders_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(address_id);


--
-- Name: orders orders_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(payment_id);


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict REZOcbOqcnpOrlOIUnWxFghD475bQEEhOMIT8IBUEe82McNLCoeS1ngprUsvxYG

