"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLayoutPage;
const admin_layout_1 = require("@/components/admin/admin-layout");
function AdminLayoutPage({ children, }) {
    return <admin_layout_1.AdminLayout>{children}</admin_layout_1.AdminLayout>;
}
