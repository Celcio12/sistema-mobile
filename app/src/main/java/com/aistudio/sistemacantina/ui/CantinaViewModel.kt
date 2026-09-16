package com.aistudio.sistemacantina.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.aistudio.sistemacantina.data.AppDatabase
import com.aistudio.sistemacantina.data.EmployeeEntity
import com.aistudio.sistemacantina.data.SaleEntity
import com.aistudio.sistemacantina.data.SettingsEntity
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

class CantinaViewModel(application: Application) : AndroidViewModel(application) {
    private val dao = AppDatabase.getDatabase(application).cantinaDao()

    val sales = dao.getAllSales().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val employees = dao.getAllEmployees().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val settings = dao.getSettings().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    init {
        // Mock initial data if empty
        viewModelScope.launch {
            dao.insertSettings(SettingsEntity("1", "CANTINA EP", "Sistema Gestão", "5000000000"))
            
            val mockEmployees = listOf(
                EmployeeEntity(UUID.randomUUID().toString(), "Celcio Pinto", "Admin", "Masculino", "online", "Hoje"),
                EmployeeEntity(UUID.randomUUID().toString(), "Ana Maria", "Caixa", "Feminino", "offline", "14:30")
            )
            dao.insertEmployees(mockEmployees)

            val mockSales = listOf(
                SaleEntity(
                    id = "V-1001",
                    date = "2026-09-16T10:00:00",
                    itemsStr = "2x Sumo Compal, 1x Sandes Mista",
                    quantity = 3,
                    finalTotal = 1500.0,
                    taxTotal = 210.0,
                    amountReceived = 2000.0,
                    amountChange = 500.0,
                    employeeName = "Ana Maria",
                    customerName = "Consumidor Final",
                    customerNif = "999999999",
                    paymentMethod = "dinheiro"
                ),
                SaleEntity(
                    id = "V-1002",
                    date = "2026-09-16T10:30:00",
                    itemsStr = "1x Café, 1x Pastel de Nata",
                    quantity = 2,
                    finalTotal = 800.0,
                    taxTotal = 112.0,
                    amountReceived = 800.0,
                    amountChange = 0.0,
                    employeeName = "Celcio Pinto",
                    customerName = "Consumidor Final",
                    customerNif = "999999999",
                    paymentMethod = "cartao"
                )
            )
            dao.insertSales(mockSales)
        }
    }
}
