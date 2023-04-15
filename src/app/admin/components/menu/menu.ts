import { Menu } from './menu.model'; 

export const menuItems = [ 
    new Menu (10, 'ADMIN_NAV.DASHBOARD', '/admin', null, 'dashboard', null, false, 0),
    new Menu (20, 'Productos', null, null, 'grid_on', null, true, 0),  
    new Menu (21, 'Categorias', '/admin/products/categories', null, 'category', null, false, 20), 
    new Menu (21, 'Colores', '/admin/products/colors', null, 'color_lens', null, false, 20),
    new Menu (21, 'Materiales', '/admin/products/materials', null, 'description', null, false, 20), 
    new Menu (22, 'Lista de Productos', '/admin/products/product-list', null, 'list', null, false, 20), 
    new Menu (23, 'Detalle de Producto', '/admin/products/product-detail', null, 'remove_red_eye', null, false, 20),  
    new Menu (24, 'Añadir Producto', '/admin/products/add-product', null, 'add_circle_outline', null, false, 20), 
    new Menu (30, 'Ventas', null, null, 'monetization_on', null, true, 0), 
    new Menu (62, 'Ordenes', '/admin/ordenes', null, 'shopping_cart', null, false, 30),  
    // new Menu (31, 'Pedidos', '/admin/sales/orders', null, 'list_alt', null, false, 30), 
    // new Menu (32, 'Transacción', '/admin/sales/transactions', null, 'local_atm', null, false, 30),  
    new Menu (40, 'Usuarios', '/admin/users', null, 'person', null, false, 0),   
    new Menu (50, 'Clientes', '/admin/customers', null, 'group', null, false, 0),  
    new Menu (60, 'Ofertas', '/admin/coupons', null, 'local_offer', null, false, 0),  
    new Menu (60, 'Roles', '/admin/roles', null, 'supervised_user_circle', null, false, 0),  
    new Menu (61, 'Banner', '/admin/banner', null, 'photo_library', null, false, 0),  
    // new Menu (70, 'Retirar', '/admin/withdrawal', null, 'credit_card', null, false, 0), 
    // new Menu (80, 'Análisis', '/admin/analytics', null, 'multiline_chart', null, false, 0), 
    // new Menu (90, 'Reembolso', '/admin/refund', null, 'restore', null, false, 0),  
    new Menu (100, 'Preguntas Frecuentes', '/admin/followers', null, 'help_outline', null, false, 0), 
    // new Menu (110, 'Soporte', '/admin/support', null, 'support', null, false, 0), 
    // new Menu (120, 'Comentarios', '/admin/reviews', null, 'insert_comment', null, false, 0), 
    // new Menu (140, 'Nivel 1', null, null, 'more_horiz', null, true, 0),
    // new Menu (141, 'Nivel 2', null, null, 'folder_open', null, true, 140),
    // new Menu (142, 'Nivel 3', null, null, 'folder_open', null, true, 141),
    // new Menu (143, 'Nivel 4', null, null, 'folder_open', null, true, 142),
    // new Menu (144, 'Nivel 5', null, '/', 'link', null, false, 143),
    // new Menu (200, 'Enlace Externo', null, 'http://themeseason.com', 'open_in_new', '_blank', false, 0)
]