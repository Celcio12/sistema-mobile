package com.aistudio.sistemacantina.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "sales")
data class SaleEntity(
    @PrimaryKey val id: String,
    val date: String,
    val itemsStr: String, // simple string representation or json
    val quantity: Int,
    val finalTotal: Double,
    val taxTotal: Double,
    val amountReceived: Double,
    val amountChange: Double,
    val employeeName: String,
    val customerName: String,
    val customerNif: String,
    val paymentMethod: String
)

@Entity(tableName = "employees")
data class EmployeeEntity(
    @PrimaryKey val id: String,
    val name: String,
    val role: String,
    val gender: String,
    val status: String,
    val lastActive: String
)

@Entity(tableName = "settings")
data class SettingsEntity(
    @PrimaryKey val id: String,
    val name: String,
    val businessType: String,
    val nif: String
)
