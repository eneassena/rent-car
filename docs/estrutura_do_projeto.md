

### mapa de pastas 


```txt
src/
├── app/
│   ├── App.tsx
│   └── routes.tsx
│
├── features/
│   ├── dashboard/pages,dashboard
│   ├── clients/pages,components,hooks,services,types
│   ├── vehicles/pages,components,hooks,services,types
│   ├── rentals/pages,components,hooks,services,types
│   ├── users/pages,components,hooks,services,types
│   └── auth/pages,hooks,services
│
├── shared/
│   ├── components/
│   └── layout/
│       ├── MainLayout/
│       ├── Sidebar/
│       └── Header/
│
├── contexts/
├── services/
├── types/
├── index.css
└── main.tsx
```



### Mapa para layout do fluxo de crud

```
features/
├── clients/
│   ├── pages/
│   │   ├── ClientList/
│   │   ├── ClientCreate/
│   │   ├── ClientEdit/
│   │   └── ClientDetails/
│   └── ...
├── vehicles/
│   ├── pages/
│   │   ├── VehicleList/
│   │   ├── VehicleCreate/
│   │   ├── VehicleEdit/
│   │   └── VehicleDetails/
│   └── ...
└── rentals/
    ├── pages/
    │   ├── RentalList/
    │   ├── RentalCreate/
    │   ├── RentalEdit/
    │   └── RentalDetails/
    └── ...
```



### Anthentication


```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
│
├── features/
│   └── auth/
│       ├── pages/
│       │   └── Login/
│       │       ├── index.tsx
│       │       └── style.css
│       │
│       ├── components/
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── services/
│       │   └── authService.ts
│       └── types/
│           └── auth.ts
│
├── shared/
│   └── components/
│       └── ProtectedRoute/
│           ├── index.tsx
│           └── style.css
````



#### Responsabilidade de cada parte

* [ Arquivo ] / [ Responsabilidade ]

---
* Login/index.tsx	/ Exibir formulário de login 

--- 
* AuthContext.tsx / Manter o estado global do usuário autenticado

---
* useAuth.ts	/ Facilitar o acesso às funções e informações de autenticação
---
* authService.ts	Executar login, logout e consulta da sessão
---
* auth.ts	Definir os tipos TypeScript da autenticação
---
* ProtectedRoute	Impedir acesso às páginas privadas sem autenticação


### Arquitetura de componentes
Como você terá três tabelas com comportamentos parecidos, recomendo esta estrutura:

```
src/shared/components/
├── DataTable/
│   ├── index.tsx
│   └── style.css
├── TableActions/
│   ├── index.tsx
│   └── style.css
├── StatusBadge/
│   ├── index.tsx
│   └── style.css
└── SearchInput/
    ├── index.tsx
    └── style.css
```

A responsabilidade de cada componente:
- DataTable: estrutura visual da tabela.
- TableActions: visualizar, editar e excluir.
- StatusBadge: exibir os diferentes estados.
- SearchInput: campo de pesquisa reutilizável.


Minha recomendação para começarmos
Eu seguiria nesta ordem:
1. Construir o componente DataTable reutilizável.
2. Implementar TableActions dentro dele.
3. Criar StatusBadge.
4. Adaptar a listagem de clientes.
5. Reutilizar a estrutura nas listagens de veículos e locações.


O StatusBadge é um componente reutilizável responsável por exibir visualmente o status de um registro na tabela.

No seu sistema Rent Car, ele será útil principalmente para identificar rapidamente a situação de clientes, veículos e locações.

Onde utilizar no seu projeto?
Entidade	Exemplos de status
Clientes	Ativo, Inativo
Veículos	Disponível, Alugado, Manutenção
Locações	Pendente, Confirmada, Em andamento, Finalizada, Cancelada



---
Como criar o componente?
Estrutura:

```
shared/
└── components/
    └── StatusBadge/
        ├── index.tsx
        └── style.css

```

