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

interface Manager {
  _id: string
  name: string
  phoneNumber: string
  email: string
  employeeId: string
  password?: string
  isVerified: boolean
  visaIds: string[]
  points: number
  createdAt: string
  updatedAt: string
  __v: number
}

interface ManagerFormData {
  name: string
  email: string
  phoneNumber: string
  employeeId: string
  password?: string
}

const ManagerManagement = () => {
  const [managers, setManagers] = useState<Manager[]>([])
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingManager, setEditingManager] = useState<Manager | null>(null)
  const [deletingManager, setDeletingManager] = useState<Manager | null>(null)
  const [formData, setFormData] = useState<ManagerFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    employeeId: "",
    password: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchManagers()
  }, [])

  useEffect(() => {
    const filtered = managers.filter((manager) => {
      if (!manager) return false // Skip if manager is null/undefined

      const name = manager.name?.toLowerCase() || ""
      const email = manager.email?.toLowerCase() || ""
      const phoneNumber = manager.phoneNumber || ""
      const employeeId = manager.employeeId?.toLowerCase() || ""
      const searchLower = searchTerm.toLowerCase()

      return (
        name.includes(searchLower) ||
        email.includes(searchLower) ||
        phoneNumber.includes(searchTerm) ||
        employeeId.includes(searchLower)
      )
    })
    setFilteredManagers(filtered)
  }, [searchTerm, managers])

  const fetchManagers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/manager/GetAll")
      if (!response.ok) {
        throw new Error("Failed to fetch managers")
      }
      const data = await response.json()

      // Filter out any null/undefined entries and ensure required fields exist
      const validManagers = (Array.isArray(data) ? data : []).filter(
        (manager) => manager && manager._id && manager.name && manager.email,
      )

      setManagers(validManagers)
      setFilteredManagers(validManagers)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  const handleCreateManager = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/manager/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create manager")
      }

      const newManager = await response.json()
      setManagers((prev) => [...prev, newManager])
      setIsCreateDialogOpen(false)
      setFormData({ name: "", email: "", phoneNumber: "", employeeId: "", password: "" })
      setSuccessMessage("Manager created successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create manager")
      setTimeout(() => setError(""), 5000)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateManager = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingManager) return

    setFormLoading(true)

    try {
      // Create update data without password first
      const updateData: Partial<ManagerFormData> = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        employeeId: formData.employeeId,
      }

      // Only include password if it's not empty
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password
      }

      const response = await fetch(`http://localhost:5000/api/manager/updateById/${editingManager._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update manager")
      }

      const updatedManager = await response.json()
      setManagers((prev) => prev.map((mgr) => (mgr._id === editingManager._id ? updatedManager : mgr)))
      setIsEditDialogOpen(false)
      setEditingManager(null)
      setFormData({ name: "", email: "", phoneNumber: "", employeeId: "", password: "" })
      setSuccessMessage("Manager updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update manager")
      setTimeout(() => setError(""), 5000)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteManager = async () => {
    if (!deletingManager) return

    setDeletingId(deletingManager._id)

    try {
      const response = await fetch(`http://localhost:5000/api/manager/deleteByID/${deletingManager._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete manager")
      }

      setManagers((prev) => prev.filter((mgr) => mgr._id !== deletingManager._id))
      setIsDeleteDialogOpen(false)
      setDeletingManager(null)
      setSuccessMessage("Manager deleted successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete manager")
      setTimeout(() => setError(""), 5000)
    } finally {
      setDeletingId(null)
    }
  }

  const handleVerifyManager = async (id: string, currentStatus: boolean) => {
    setVerifyingId(id)
    try {
      const response = await fetch(`http://localhost:5000/api/manager/verify/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVerified: !currentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify manager")
      }

      setManagers((prev) => prev.map((mgr) => (mgr._id === id ? { ...mgr, isVerified: !currentStatus } : mgr)))

      setSuccessMessage(`Manager ${!currentStatus ? "verified" : "unverified"} successfully`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify manager")
      setTimeout(() => setError(""), 5000)
    } finally {
      setVerifyingId(null)
    }
  }

  const openEditDialog = (manager: Manager) => {
    setEditingManager(manager)
    setFormData({
      name: manager.name,
      email: manager.email,
      phoneNumber: manager.phoneNumber,
      employeeId: manager.employeeId,
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (manager: Manager) => {
    setDeletingManager(manager)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (field: keyof ManagerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
        Manager Management
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
          placeholder="Search managers..."
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
          onClick={() => {
            setFormData({ name: "", email: "", phoneNumber: "", employeeId: "", password: "" })
            setIsCreateDialogOpen(true)
          }}
          sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
        >
          Add Manager
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: 1, borderColor: "divider" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Employee ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Points</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Joined Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredManagers.map((manager) => (
              <TableRow key={manager._id} hover>
                <TableCell sx={{ fontWeight: "medium" }}>{manager.name}</TableCell>
                <TableCell>
                  <Chip label={manager.employeeId} variant="outlined" size="small" />
                </TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.phoneNumber}</TableCell>
                <TableCell>{manager.points}</TableCell>
                <TableCell>
                  <Chip
                    label={manager.isVerified ? "Verified" : "Unverified"}
                    color={manager.isVerified ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(manager.createdAt)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title={manager.isVerified ? "Unverify Manager" : "Verify Manager"}>
                      <IconButton
                        size="small"
                        disabled={verifyingId === manager._id}
                        onClick={() => handleVerifyManager(manager._id, manager.isVerified)}
                        color={manager.isVerified ? "warning" : "success"}
                      >
                        {verifyingId === manager._id ? (
                          <CircularProgress size={20} />
                        ) : manager.isVerified ? (
                          <UserX />
                        ) : (
                          <UserCheck />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Manager">
                      <IconButton size="small" onClick={() => openEditDialog(manager)} color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Manager">
                      <IconButton
                        size="small"
                        onClick={() => openDeleteDialog(manager)}
                        color="error"
                        disabled={deletingId === manager._id}
                      >
                        {deletingId === manager._id ? <CircularProgress size={20} /> : <Trash2 />}
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
        Showing {filteredManagers.length} of {managers.length} managers
      </Typography>

      {/* Create Manager Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => {
        setFormData({ name: "", email: "", phoneNumber: "", employeeId: "", password: "" })
        setIsCreateDialogOpen(false)
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New Manager
          <IconButton
            aria-label="close"
            onClick={() => {
              setFormData({ name: "", email: "", phoneNumber: "", employeeId: "", password: "" })
              setIsCreateDialogOpen(false)
            }}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleCreateManager}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Add a new manager to the system. Please provide a unique employee ID.
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
                label="Employee ID"
                value={formData.employeeId}
                onChange={handleInputChange("employeeId")}
                required
                fullWidth
                helperText="Enter a unique employee ID for this manager"
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
            <Button onClick={() => {
              setFormData({ name: "", email: "", phoneNumber: "", employeeId: "", password: "" })
              setIsCreateDialogOpen(false)
            }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              Create Manager
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Manager Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Manager
          <IconButton
            aria-label="close"
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleUpdateManager}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Update manager information. Leave password empty to keep current password.
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
                label="Employee ID"
                value={formData.employeeId}
                onChange={handleInputChange("employeeId")}
                required
                fullWidth
                helperText="Employee ID must be unique"
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
              Update Manager
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the manager account for <strong>{deletingManager?.name}</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteManager} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default ManagerManagement
