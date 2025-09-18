"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material"
import {
  Search,
  Add as Plus,
  Edit,
  Delete as Trash2,
  PersonAddAlt as UserCheck,
  PersonRemove as UserX,
  Close,
} from "@mui/icons-material"

interface Employee {
  _id: string
  name: string
  phoneNumber: string
  email: string
  password?: string
  isVerified: boolean
  visaIds: string[]
  points: number
  createdAt: string
  updatedAt: string
  __v: number
}

interface EmployeeFormData {
  name: string
  email: string
  phoneNumber: string
  password?: string // Make password optional
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      if (!employee) return false // Skip if employee is null/undefined

      const name = employee.name?.toLowerCase() || ""
      const email = employee.email?.toLowerCase() || ""
      const phoneNumber = employee.phoneNumber || ""
      const searchLower = searchTerm.toLowerCase()

      return name.includes(searchLower) || email.includes(searchLower) || phoneNumber.includes(searchTerm)
    })
    setFilteredEmployees(filtered)
  }, [searchTerm, employees])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/employee/getAll")
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }
      const data = await response.json()

      // Filter out any null/undefined entries and ensure required fields exist
      const validEmployees = (Array.isArray(data) ? data : []).filter(
        (employee) => employee && employee._id && employee.name && employee.email,
      )

      setEmployees(validEmployees)
      setFilteredEmployees(validEmployees)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  const handleCreateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const response = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/employee/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create employee")
      }

      const newEmployee = await response.json()
      setEmployees((prev) => [...prev, newEmployee])
      setIsCreateDialogOpen(false)
      setFormData({ name: "", email: "", phoneNumber: "", password: "" })
      setSuccessMessage("Employee created successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create employee")
      setTimeout(() => setError(""), 5000)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingEmployee) return

    setFormLoading(true)

    try {
      // Create update data without password first
      const updateData: Partial<EmployeeFormData> = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      }

      // Only include password if it's not empty
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password
      }

      const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/employee/upadtebyId/${editingEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update employee")
      }

      const updatedEmployee = await response.json()
      setEmployees((prev) => prev.map((emp) => (emp._id === editingEmployee._id ? updatedEmployee : emp)))
      setIsEditDialogOpen(false)
      setEditingEmployee(null)
      setFormData({ name: "", email: "", phoneNumber: "", password: "" })
      setSuccessMessage("Employee updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update employee")
      setTimeout(() => setError(""), 5000)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return

    setDeletingId(deletingEmployee._id)

    try {
      const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/employee/delete/${deletingEmployee._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete employee")
      }

      setEmployees((prev) => prev.filter((emp) => emp._id !== deletingEmployee._id))
      setIsDeleteDialogOpen(false)
      setDeletingEmployee(null)
      setSuccessMessage("Employee deleted successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete employee")
      setTimeout(() => setError(""), 5000)
    } finally {
      setDeletingId(null)
    }
  }

  const handleVerifyEmployee = async (id: string, currentStatus: boolean) => {
    setVerifyingId(id)
    try {
      const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/employee/verify/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVerified: !currentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify employee")
      }

      setEmployees((prev) => prev.map((emp) => (emp._id === id ? { ...emp, isVerified: !currentStatus } : emp)))

      setSuccessMessage(`Employee ${!currentStatus ? "verified" : "unverified"} successfully`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify employee")
      setTimeout(() => setError(""), 5000)
    } finally {
      setVerifyingId(null)
    }
  }

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (employee: Employee) => {
    setDeletingEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (field: keyof EmployeeFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Employee Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search employees..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
          }}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          sx={{ width: 320 }}
        />

        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setIsCreateDialogOpen(true)}
          sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
        >
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: 1, borderColor: "divider" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Points</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Joined Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee._id} hover>
                <TableCell sx={{ fontWeight: "medium" }}>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{employee.points}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.isVerified ? "Verified" : "Unverified"}
                    color={employee.isVerified ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(employee.createdAt)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title={employee.isVerified ? "Unverify Employee" : "Verify Employee"}>
                      <IconButton
                        size="small"
                        disabled={verifyingId === employee._id}
                        onClick={() => handleVerifyEmployee(employee._id, employee.isVerified)}
                        color={employee.isVerified ? "warning" : "success"}
                      >
                        {verifyingId === employee._id ? (
                          <CircularProgress size={20} />
                        ) : employee.isVerified ? (
                          <UserX />
                        ) : (
                          <UserCheck />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Employee">
                      <IconButton size="small" onClick={() => openEditDialog(employee)} color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Employee">
                      <IconButton
                        size="small"
                        onClick={() => openDeleteDialog(employee)}
                        color="error"
                        disabled={deletingId === employee._id}
                      >
                        {deletingId === employee._id ? <CircularProgress size={20} /> : <Trash2 />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Showing {filteredEmployees.length} of {employees.length} employees
      </Typography>

      {/* Create Employee Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New Employee
          <IconButton
            aria-label="close"
            onClick={() => setIsCreateDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleCreateEmployee}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Add a new employee to the system. They will need to be verified before they can access the system.
            </DialogContentText>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              Create Employee
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Employee
          <IconButton
            aria-label="close"
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleUpdateEmployee}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Update employee information. Leave password empty to keep current password.
            </DialogContentText>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                required
                fullWidth
              />
              <TextField
                label="New Password (optional)"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="Leave empty to keep current password"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              Update Employee
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the employee account for <strong>{deletingEmployee?.name}</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteEmployee} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default EmployeeManagement
