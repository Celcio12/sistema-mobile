package com.aistudio.sistemacantina.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.aistudio.sistemacantina.data.SettingsEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainLayoutScreen(
    onLogout: () -> Unit,
    viewModel: CantinaViewModel = viewModel()
) {
    var activeTab by remember { mutableStateOf("produtos") }
    val settings by viewModel.settings.collectAsState()

    val companyName = settings?.name ?: "Cantina EP"
    val companyType = settings?.businessType ?: "Sistema Gestão"

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
                            color = Color(0xFFFF7A00),
                            modifier = Modifier.size(40.dp)
                        ) {
                            Icon(
                                Icons.Default.Storefront,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.padding(8.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(companyName, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Text(companyType, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 12.sp)
                        }
                    }
                },
                actions = {
                    Box(modifier = Modifier.padding(end = 16.dp)) {
                        IconButton(onClick = { /* Notifications */ }) {
                            Icon(Icons.Default.Notifications, contentDescription = "Notifications", tint = Color(0xFFFF7A00))
                        }
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(top = 8.dp, end = 8.dp)
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFFF4400)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("2", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.95f)
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.95f),
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Inventory2, contentDescription = "Produtos") },
                    label = { Text("Produtos") },
                    selected = activeTab == "produtos",
                    onClick = { activeTab = "produtos" },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFFF7A00),
                        indicatorColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Group, contentDescription = "Funcionários") },
                    label = { Text("Funcionários") },
                    selected = activeTab == "funcionarios",
                    onClick = { activeTab = "funcionarios" },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFFF7A00),
                        indicatorColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.TrendingUp, contentDescription = "Relatórios") },
                    label = { Text("Relatórios") },
                    selected = activeTab == "relatorios",
                    onClick = { activeTab = "relatorios" },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFFF7A00),
                        indicatorColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Config") },
                    label = { Text("Config") },
                    selected = activeTab == "config",
                    onClick = { activeTab = "config" },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFFF7A00),
                        indicatorColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                )
            }
        }
    ) { padding ->
        Box(modifier = Modifier
            .padding(padding)
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
        ) {
            when (activeTab) {
                "produtos" -> ProdutosScreen(viewModel)
                "funcionarios" -> FuncionariosScreen(viewModel)
                "relatorios" -> RelatoriosScreen(viewModel)
                "config" -> ConfigScreen(onLogout)
            }
        }
    }
}
