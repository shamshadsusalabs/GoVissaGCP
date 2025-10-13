"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import * as Print from "expo-print"
import * as FileSystem from "expo-file-system"

interface Payment {
  _id: string
  orderId: string
  amount: number
  currency: string
  country: string
  status: string
  email: string
  phone: string
  selectedDate: string
  travellers: number
  createdAt: number
  paidAt?: string
  paymentId?: string
}

const Bill = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Only run once when component mounts and params are available
    if (params.id && !payment) {
      const reconstructedPayment: Payment = {
        _id: params.id as string,
        orderId: params.orderId as string,
        amount: Number.parseInt(params.amount as string),
        currency: params.currency as string,
        status: params.status as string,
        email: params.email as string,
        phone: params.phone as string,
        selectedDate: params.selectedDate as string,
        travellers: Number.parseInt(params.travellers as string),
        createdAt: Number.parseInt(params.createdAt as string),
        paymentId: params.paymentId as string,
        country: params.country as string,
      }
      setPayment(reconstructedPayment)
    } else if (!params.id && !payment) {
      router.back()
    }
  }, [
    params.id,
    params.orderId,
    params.amount,
    params.currency,
    params.status,
    params.email,
    params.phone,
    params.selectedDate,
    params.travellers,
    params.createdAt,
    params.paymentId,
    params.country,
    payment,
  ])

  const formatDate = (dateString: string | number) => {
    if (typeof dateString === "number") {
      return new Date(dateString * 1000).toLocaleDateString("en-IN")
    }
    return new Date(dateString).toLocaleDateString("en-IN")
  }

  const calculateTaxes = (amount: number) => {
    const subtotal = amount / 100
    const cgst = subtotal * 0.09 // 9% CGST
    const sgst = subtotal * 0.09 // 9% SGST
    const total = subtotal + cgst + sgst
    return { subtotal, cgst, sgst, total }
  }

  const generateHTMLContent = () => {
    if (!payment) return ""

    const { subtotal, cgst, sgst, total } = calculateTaxes(payment.amount)

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #ffffff;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 30px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-section {
          width: 30%;
        }
        .company-info {
          width: 65%;
          text-align: right;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 10px;
        }
        .company-details {
          font-size: 14px;
          line-height: 1.5;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 30px 0;
        }
        .detail-box {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }
        .section-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 15px;
          color: #1f2937;
        }
        .invoice-info {
          display: flex;
          justify-content: flex-end;
          margin: 20px 0;
        }
        .info-table {
          width: 300px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        .table-header {
          background-color: #1f2937;
          color: white;
        }
        .table-cell {
          padding: 12px 8px;
          border: 1px solid #d1d5db;
          text-align: left;
        }
        .totals-section {
          margin-left: auto;
          width: 300px;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .final-total {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 18px;
          padding-top: 15px;
          border-top: 2px solid #1f2937;
        }
        .footer {
          margin-top: 50px;
          border-top: 2px solid #d1d5db;
          padding-top: 20px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .footer-text {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo-section">
            <div style="width: 150px; height: 60px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #1f2937;">
              GOVISAA LOGO
            </div>
          </div>
          <div class="company-info">
            <h1 class="invoice-title">TAX INVOICE</h1>
            <div class="company-details">
              <p style="font-weight: bold; margin: 0;">KEHAR TRAVEL SERVICES PRIVATE LIMITED</p>
              <p style="margin: 5px 0;">GSTIN: 06AACCK3779PZZU</p>
              <p style="margin: 5px 0; font-size: 12px;">Registration Valid From: 15/02/2022</p>
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <h2 class="section-title">Customer Details:</h2>
            <div class="detail-box">
              <p style="font-weight: 600; margin: 0 0 10px 0;">${payment.email.split("@")[0]}</p>
              <p style="margin: 5px 0;">Email: ${payment.email}</p>
              <p style="margin: 5px 0;">Contact: ${payment.phone}</p>
              <p style="margin: 5px 0;">Booking Date: ${formatDate(payment.createdAt)}</p>
            </div>
          </div>
          <div>
            <h2 class="section-title">Booking Details:</h2>
            <div class="detail-box">
              <p style="font-weight: 600; margin: 0 0 10px 0;">Order ID: ${payment.orderId}</p>
              <p style="margin: 5px 0;">Payment ID: ${payment.paymentId || "N/A"}</p>
              <p style="margin: 5px 0;">Country: ${payment.country}</p>
              <p style="margin: 5px 0;">Travel Date: ${formatDate(payment.selectedDate)}</p>
              <p style="margin: 5px 0;">Travellers: ${payment.travellers}</p>
            </div>
          </div>
        </div>

        <div class="invoice-info">
          <div class="info-table">
            <div class="info-row">
              <span style="font-weight: bold;">Invoice Number:</span>
              <span>${payment.orderId}</span>
            </div>
            <div class="info-row">
              <span style="font-weight: bold;">Date:</span>
              <span>${formatDate(payment.createdAt)}</span>
            </div>
            <div class="info-row">
              <span style="font-weight: bold;">GST Category:</span>
              <span>Regular</span>
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr class="table-header">
              <th class="table-cell">S.No</th>
              <th class="table-cell">Service</th>
              <th class="table-cell">Description</th>
              <th class="table-cell">Country</th>
              <th class="table-cell">HSN/SAC</th>
              <th class="table-cell">Qty</th>
              <th class="table-cell">Rate (₹)</th>
              <th class="table-cell">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="table-cell">1</td>
              <td class="table-cell">Visa Processing</td>
              <td class="table-cell">Travel visa service for ${payment.travellers} person(s)</td>
              <td class="table-cell">${payment.country}</td>
              <td class="table-cell">9983</td>
              <td class="table-cell">${payment.travellers}</td>
              <td class="table-cell">₹${(subtotal / payment.travellers).toFixed(2)}</td>
              <td class="table-cell">₹${subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>CGST (9%):</span>
            <span>₹${cgst.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>SGST (9%):</span>
            <span>₹${sgst.toFixed(2)}</span>
          </div>
          <div class="final-total">
            <span>Total:</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <div class="footer-grid">
            <div>
              <h3 style="font-weight: bold; margin-bottom: 15px;">Bank Details:</h3>
              <p style="margin: 5px 0;">Account Name: KEHAR TRAVEL SERVICES PVT LTD</p>
              <p style="margin: 5px 0;">Account Number: XXXX XXXX XXXX 1523</p>
              <p style="margin: 5px 0;">Bank Name: Example Bank</p>
              <p style="margin: 5px 0;">IFSC Code: EXMP0000123</p>
            </div>
            <div style="text-align: center;">
              <p style="margin-bottom: 60px;">Authorized Signatory</p>
              <p>For KEHAR TRAVEL SERVICES PVT LTD</p>
            </div>
          </div>
          <div class="footer-text">
            <p>GSTIN: 06AACCK3779PZZU | Registration Valid From: 15/02/2022</p>
            <p style="margin-top: 10px;">Thank you for choosing Govisaa - Your Gateway to the World!</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `
  }

  const handleDownloadPDF = async () => {
    if (!payment) return

    try {
      setLoading(true)
      const htmlContent = generateHTMLContent()

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      })

      const fileName = `Kehar_Travel_Invoice_${payment.orderId}.pdf`
      const newUri = `${FileSystem.documentDirectory}${fileName}`

      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      })

      Alert.alert("Success", `Invoice downloaded successfully!\nSaved to: ${fileName}`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      Alert.alert("Error", "Failed to generate PDF. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!payment) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 text-base">Loading invoice...</Text>
      </View>
    )
  }

  const { subtotal, cgst, sgst, total } = calculateTaxes(payment.amount)

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-16 pb-6 border-b border-gray-100">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Invoice</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Invoice Container */}
        <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
          {/* Header Section */}
          <View className="mb-8 pb-6 border-b border-gray-200">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="w-32 h-16 bg-gray-100 rounded-lg items-center justify-center mb-2">
                  <Text className="font-bold text-gray-700">GOVISAA</Text>
                  <Text className="text-xs text-gray-500">LOGO</Text>
                </View>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-2xl font-bold text-blue-800 mb-2">TAX INVOICE</Text>
                <Text className="font-bold text-gray-900 text-right">KEHAR TRAVEL SERVICES</Text>
                <Text className="font-bold text-gray-900 text-right">PRIVATE LIMITED</Text>
                <Text className="text-sm text-gray-600 mt-1">GSTIN: 06AACCK3779PZZU</Text>
                <Text className="text-xs text-gray-500">Registration Valid From: 15/02/2022</Text>
              </View>
            </View>
          </View>

          {/* Customer Details Section */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">Customer Details</Text>
            <View className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <View className="space-y-3">
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-24">Name:</Text>
                  <Text className="font-semibold text-gray-900 flex-1">{payment.email.split("@")[0]}</Text>
                </View>
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-24">Email:</Text>
                  <Text className="text-gray-900 flex-1">{payment.email}</Text>
                </View>
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-24">Contact:</Text>
                  <Text className="text-gray-900 flex-1">{payment.phone}</Text>
                </View>
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-24">Date:</Text>
                  <Text className="text-gray-900 flex-1">{formatDate(payment.createdAt)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Booking Details Section */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">Booking Details</Text>
            <View className="bg-green-50 rounded-xl p-5 border border-green-100">
              <View className="space-y-3">
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-28">Order ID:</Text>
                  <Text className="font-semibold text-gray-900 flex-1">{payment.orderId}</Text>
                </View>
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-28">Payment ID:</Text>
                  <Text className="text-gray-900 flex-1">{payment.paymentId || "N/A"}</Text>
                </View>
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-28">Country:</Text>
                  <Text className="text-gray-900 flex-1">{payment.country}</Text>
                </View>
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-28">Travel Date:</Text>
                  <Text className="text-gray-900 flex-1">{formatDate(payment.selectedDate)}</Text>
                </View>
                <View className="flex-row">
                  <Text className="font-semibold text-gray-700 w-28">Travellers:</Text>
                  <Text className="text-gray-900 flex-1">{payment.travellers}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Invoice Info */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">Invoice Information</Text>
            <View className="bg-gray-50 rounded-xl p-5">
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-gray-700">Invoice Number:</Text>
                  <Text className="text-gray-900">{payment.orderId}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-gray-700">Date:</Text>
                  <Text className="text-gray-900">{formatDate(payment.createdAt)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-gray-700">GST Category:</Text>
                  <Text className="text-gray-900">Regular</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Service Details */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">Service Details</Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Table Header */}
              <View className="bg-gray-800 p-4">
                <View className="flex-row">
                  <Text className="text-white font-bold text-xs flex-1">Service</Text>
                  <Text className="text-white font-bold text-xs w-16 text-center">Qty</Text>
                  <Text className="text-white font-bold text-xs w-20 text-right">Rate</Text>
                  <Text className="text-white font-bold text-xs w-24 text-right">Amount</Text>
                </View>
              </View>

              {/* Table Content */}
              <View className="p-4 bg-white">
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">Visa Processing Service</Text>
                    <Text className="text-sm text-gray-600 mb-1">
                      Travel visa service for {payment.travellers} person(s)
                    </Text>
                    <Text className="text-sm text-gray-600">Destination: {payment.country}</Text>
                    <Text className="text-xs text-gray-500 mt-1">HSN/SAC: 9983</Text>
                  </View>
                  <Text className="w-16 text-center text-gray-900 font-semibold">{payment.travellers}</Text>
                  <Text className="w-20 text-right text-gray-900">₹{(subtotal / payment.travellers).toFixed(2)}</Text>
                  <Text className="w-24 text-right font-bold text-gray-900">₹{subtotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Totals Section */}
          <View className="mb-8">
            <View className="bg-gray-50 rounded-xl p-5">
              <View className="space-y-3">
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-700 font-medium">Subtotal:</Text>
                  <Text className="text-gray-900 font-semibold">₹{subtotal.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-700 font-medium">CGST (9%):</Text>
                  <Text className="text-gray-900 font-semibold">₹{cgst.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-700 font-medium">SGST (9%):</Text>
                  <Text className="text-gray-900 font-semibold">₹{sgst.toFixed(2)}</Text>
                </View>
                <View className="border-t-2 border-gray-300 pt-3 mt-3">
                  <View className="flex-row justify-between">
                    <Text className="text-xl font-bold text-gray-900">Total Amount:</Text>
                    <Text className="text-xl font-bold text-blue-600">₹{total.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Footer Section */}
          <View className="border-t-2 border-gray-200 pt-6">
            {/* Bank Details */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">Bank Details</Text>
              <View className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                <View className="space-y-2">
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Account Name:</Text> KEHAR TRAVEL SERVICES PVT LTD
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Account Number:</Text> XXXX XXXX XXXX 1523
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Bank Name:</Text> Example Bank
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-semibold">IFSC Code:</Text> EXMP0000123
                  </Text>
                </View>
              </View>
            </View>

            {/* Signature Section */}
            <View className="items-center mb-6">
              <View className="w-48 h-20 border-b border-gray-300 mb-2"></View>
              <Text className="text-gray-600 text-center">Authorized Signatory</Text>
              <Text className="text-gray-900 font-medium text-center">For KEHAR TRAVEL SERVICES PVT LTD</Text>
            </View>

            {/* Footer Text */}
            <View className="items-center">
              <Text className="text-xs text-gray-500 text-center mb-2">
                GSTIN: 06AACCK3779PZZU | Registration Valid From: 15/02/2022
              </Text>
              <Text className="text-xs text-gray-500 text-center font-medium">
                Thank you for choosing Govisaa - Your Gateway to the World!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Download Button */}
      <View className="bg-white px-6 py-4 border-t border-gray-100 mb-12">
        <TouchableOpacity
          onPress={handleDownloadPDF}
          disabled={loading}
          className={`py-4 rounded-xl flex-row items-center justify-center ${loading ? "bg-gray-400" : "bg-gray-900"}`}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialIcons name="file-download" size={20} color="white" />
          )}
          <Text className="text-white font-semibold text-base ml-2">
            {loading ? "Generating PDF..." : "Download PDF"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Bill
