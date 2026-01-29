"use client";

import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "@/shared/components/ui/sheet";
import { User } from "@prisma/client";
import { useState } from "react";


// نوع الـ Sheet المفتوحة
type SheetType = "add" | "edit" | "view" | null;

interface AdminSheetActionsUsersProps {
  setActiveSheet: (sheet: SheetType) => void;
  activeSheet: SheetType;
  user: User | null;
}

export default function AdminSheetActionsUsers({
  setActiveSheet,
  activeSheet,
  user,
}: AdminSheetActionsUsersProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(user);


  // دالة الإغلاق الموحدة
  const closeSheet = () => {
    setActiveSheet(null);
    setTimeout(() => setSelectedUser(null), 300); // تأخير بسيط لتجنب وميض البيانات أثناء الإغلاق
  };

  return (
    <div className="p-10">
      {/* 1. Add User Sheet */}
      <Sheet open={activeSheet === "add"} onOpenChange={closeSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>إضافة مستخدم جديد</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <p>فورم الإضافة يوضع هنا...</p>
            {/* <AddUserForm /> */}
          </div>
        </SheetContent>
      </Sheet>

      {/* 2. Edit User Sheet */}
      <Sheet open={activeSheet === "edit"} onOpenChange={closeSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>تعديل المستخدم</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {selectedUser && (
              <>
                <p>
                  تعديل بيانات: <b>{selectedUser.name}</b>
                </p>
                {/* <EditUserForm defaultValues={selectedUser} /> */}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* 3. View User Sheet */}
      <Sheet open={activeSheet === "view"} onOpenChange={closeSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>تفاصيل المستخدم</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {selectedUser && (
              <div className="space-y-2">
                <p>
                  <strong>الاسم:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>البريد:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>المعرف:</strong> {selectedUser.id}
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
