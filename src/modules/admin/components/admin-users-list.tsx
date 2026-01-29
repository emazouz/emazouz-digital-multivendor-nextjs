"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  deleteAdminUserAction,
  getAdminUsersAction,
} from "../actions/admin-users.actions";
import { User, UserRole } from "@prisma/client";
import { useSearchParams } from "next/navigation";

import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { formatDate } from "@/shared/lib/date";
import Link from "next/link";
import StatsCard from "@/shared/components/stats-card";
import ConfirmDialogDeleted from "@/shared/components/confirm-dialog-deleted";
import AdminSheetActionsUsers from "./admin-sheet-actions-users";

function AdminUsersList() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState<UserRole>("USER");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAdminUsersAction({
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        role: role || "USER",
      });

      if (result.success && result.data) {
        setUsers(result.data.users);
        setPagination((prev) => ({
          ...prev,
          total: result.data!.paginated.total,
          totalPages: result.data!.paginated.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, role]);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // handleDeleteClick
  const handleDeleteClick = async (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
    return;
  };

  const handleClearFilters = () => {
    setSearch("");
    setRole("USER");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteAdminUserAction(userToDelete.id);
      if (result.success) {
        fetchUsers();
        // Update stats
      } else {
        console.error("Failed to delete user:", result.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // نوع الـ Sheet المفتوحة
  type SheetType = "add" | "edit" | "view" | null;

  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);


  const openAdd = () => {
    setSelectedUser(null);
    setActiveSheet("add");
  };



  return (
    <div className="section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">
            Manage your digital users inventory
          </p>
        </div>
        <Button asChild onClick={openAdd}>
          <Link href="/admin/users/new">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          title="Total Users"
          value={users?.length}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          title="Admins"
          value={users.filter((user) => user.role === "ADMIN").length}
          icon={<Package className="w-6 h-6 text-green-600" />}
          color="bg-green-100 dark:bg-green-900/30"
        />
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={role}
            onValueChange={(value) => {
              setRole(value as UserRole | "USER");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">User roles</SelectItem>
              {Object.entries(UserRole).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Actions */}
          <div className="flex gap-sm">
            <Button type="submit">Search</Button>
            {(search || role !== "USER") && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Users found</h3>
            <p className="text-muted-foreground mb-4">
              {search || role !== "USER"
                ? "Try adjusting your filters"
                : "Get started by adding your first product"}
            </p>
            {!search && role === "USER" && (
              <Button asChild>
                <Link href="/admin/users/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Link>
              </Button>
            )}{" "}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Full Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Date Updated</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    {/* Product Info */}
                    <TableCell>
                      <div className="max-w-[250px]">
                        <p className="font-medium truncate">{user.name}</p>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "destructive" : "secondary"
                        }
                      >
                        {/* {CATEGORY_LABELS[user.category]}
                         */}
                        {user.role}
                      </Badge>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <div>{user.email}</div>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt.toDateString())}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(user.updatedAt.toDateString())}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setActiveSheet("view");
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setActiveSheet("edit");
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} users
                </p>
                <div className="flex items-center gap-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <ConfirmDialogDeleted
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        title="Delete User"
        question={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        handleDeleteConfirm={handleDeleteConfirm}
      />

        {/* Sheet Actions Users */}
        <AdminSheetActionsUsers
        setActiveSheet={setActiveSheet}
        activeSheet={activeSheet}
        user={selectedUser}
        />
    </div>
  );
}

export default AdminUsersList;
