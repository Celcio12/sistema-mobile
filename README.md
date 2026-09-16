# Sistema de Cantina Mobile (Android Kotlin Rewrite)

Este aplicativo foi reescrito para Android nativo (Kotlin + Jetpack Compose) a partir da base original em React/Vite.
O aplicativo mantém a lógica de negócios central para gerenciar produtos, funcionários e relatórios da cantina, agora otimizado para uma experiência mobile nativa offline.

## Tecnologias Utilizadas
- **Kotlin**: Linguagem principal do projeto.
- **Jetpack Compose**: Para a construção de toda a interface do usuário (UI).
- **Room Database**: Para armazenamento local persistente dos dados (Vendas, Funcionários, Configurações), garantindo o funcionamento offline.
- **Coroutines & Flow**: Para assincronicidade e reatividade.
- **Navigation Compose**: Para a navegação entre as telas.

## Estrutura do Projeto
- `app/src/main/java/com/aistudio/sistemacantina/MainActivity.kt`: Ponto de entrada do aplicativo e configuração das rotas.
- `app/src/main/java/com/aistudio/sistemacantina/ui`: Contém a interface do utilizador, ViewModel (gestão de estado) e o tema visual (Material 3).
- `app/src/main/java/com/aistudio/sistemacantina/data`: Contém o banco de dados Room (Database, Entities, DAO) usado para mock e cache.
- `app/src/main/res`: Contém os recursos visuais, strings, e ícones do aplicativo.

## Como Executar
Este é um projeto Gradle padrão do Android.
1. Abra o diretório raiz deste projeto no **Android Studio**.
2. Aguarde a sincronização do Gradle terminar.
3. Conecte um dispositivo Android ou inicie um Emulador.
4. Clique no botão de **Run** (Play) no topo para compilar e instalar o APK no seu dispositivo.
