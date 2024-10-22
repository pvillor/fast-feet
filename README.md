# fast-feet
### Regras da aplicação
- [X] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [X] Deve ser possível realizar login com CPF e Senha
- [X] Deve ser possível realizar o CRUD dos entregadores
- [] Deve ser possível realizar o CRUD das encomendas
- [] Deve ser possível realizar o CRUD dos destinatários
- [] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [] Deve ser possível retirar uma encomenda
- [] Deve ser possível marcar uma encomenda como entregue
- [] Deve ser possível marcar uma encomenda como devolvida
- [X] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- [X] Deve ser possível alterar a senha de um usuário
- [X] Deve ser possível listar as entregas de um usuário
- [] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio
- [] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [X] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [X] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [X] Somente o admin pode alterar a senha de um usuário
- [X] Não deve ser possível um entregador listar as encomendas de outro entregador