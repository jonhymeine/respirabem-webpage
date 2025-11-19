# 🎯 Guia Rápido - Seletor de Cidades

## Como Funciona

### 1️⃣ Primeira Vez na Aplicação

Quando você abre o app pela primeira vez:

- A aplicação pede permissão para usar sua localização
- Se você permitir ✅: Mostra o clima da sua localização atual
- Se você negar ❌: Usa Itajaí/SC como localização padrão

### 2️⃣ Trocar de Cidade

**Passo 1:** Clique no botão 📝 ao lado da localização

```
📍 Itajaí, SC  [📝]
         ↑
    clique aqui
```

**Passo 2:** Escolha o país (Brasil já vem selecionado)

```
País: [Brasil ▼]
```

**Passo 3:** Escolha o estado

```
Estado: [Santa Catarina ▼]
```

**Passo 4:** Busque sua cidade

```
Buscar Cidade: [digite aqui...]

Resultados:
• Florianópolis  -27.5969, -48.5495
• Joinville      -26.3045, -48.8487
• Blumenau       -26.9194, -49.0661
```

**Passo 5:** Clique na cidade desejada

- A aplicação salva sua escolha
- Carrega os dados meteorológicos
- Próxima vez que abrir, já vem nessa cidade!

### 3️⃣ Voltar para Geolocalização

Se você mudou de cidade mas quer voltar a usar sua localização atual:

1. Abra o modal (botão 📝)
2. Clique em "📍 Usar Minha Localização"
3. Permita o acesso quando solicitado
4. Pronto! Sua localização salva foi removida

## Dicas 💡

### ⚡ Busca Rápida

Digite qualquer parte do nome da cidade:

- "flo" → encontra Florianópolis
- "join" → encontra Joinville
- "são" → encontra São Paulo, São José, etc.

### 💾 Memória Automática

- Sua cidade escolhida fica salva
- Mesmo fechando o navegador
- Mesmo após dias/semanas
- Para mudar, só escolher outra cidade!

### 🌍 Qualquer Lugar do Mundo

Embora o Brasil venha pré-selecionado, você pode escolher:

- Estados Unidos
- Portugal
- Qualquer país do mundo!

## Atalhos de Teclado

Quando o modal está aberto:

- `Esc` → Fecha o modal
- `Tab` → Navega entre os campos
- `Digite` → Busca automática nas cidades

## Resolução de Problemas

### "Nenhuma cidade encontrada"

- Verifique se escolheu o estado corretamente
- Alguns estados/províncias podem não ter cidades no banco de dados
- Tente outro estado próximo

### "Geolocalização negada"

- Verifique as configurações do navegador
- Alguns navegadores bloqueiam em HTTP (use HTTPS em produção)
- Você sempre pode escolher manualmente!

### Modal não abre

- Atualize a página (F5)
- Limpe o cache do navegador
- Verifique o console do navegador (F12)

## Dados Técnicos

### O que é salvo no navegador?

```json
{
  "country": "Brasil",
  "countryCode": "BR",
  "state": "Santa Catarina",
  "stateCode": "SC",
  "city": "Florianópolis",
  "latitude": -27.5969,
  "longitude": -48.5495
}
```

### Onde é salvo?

- `localStorage` do navegador
- Chave: `selectedLocation`
- Não expira (fica para sempre até ser deletado manualmente)

### Como limpar manualmente?

Abra o Console do navegador (F12) e digite:

```javascript
localStorage.removeItem("selectedLocation");
location.reload();
```

## Exemplos de Uso

### Caso 1: Morando em São Paulo

1. Abra o app
2. Clique em 📝
3. Estado: São Paulo
4. Busque: "são paulo"
5. Clique em São Paulo
6. Pronto! Sempre mostrará clima de SP

### Caso 2: Viajando pelo Brasil

1. Em Florianópolis: Escolha Florianópolis
2. Viajou para Porto Alegre: Mude para Porto Alegre
3. Voltou para casa: Mude de volta para Florianópolis

### Caso 3: Acompanhando familiar

1. Você mora em Curitiba
2. Seu familiar tem asma e mora em Salvador
3. Escolha Salvador para ver condições lá
4. Quando quiser ver sua cidade, mude de volta

## Perguntas Frequentes

**P: A cidade salva funciona em outros dispositivos?**
R: Não, cada dispositivo/navegador tem seu próprio armazenamento local.

**P: Posso ter múltiplas cidades favoritas?**
R: Atualmente não, mas é uma feature planejada para o futuro!

**P: Os dados de clima são em tempo real?**
R: Sim! A API Open-Meteo fornece dados atualizados.

**P: Funciona offline?**
R: A lista de cidades sim, mas os dados de clima precisam de internet.

**P: É seguro?**
R: Sim! Nenhum dado é enviado para servidores externos além da API de clima.

## Acessibilidade

- ✅ Navegação por teclado completa
- ✅ Leitores de tela compatíveis
- ✅ Alto contraste nas cores
- ✅ Textos grandes e legíveis
- ✅ Indicadores visuais claros

## Feedback

Gostou? Tem sugestões? Encontrou bugs?
Entre em contato através do repositório GitHub!

---

🫁 **RespiraBEM** - Cuidando da sua respiração, cidade por cidade
