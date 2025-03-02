# We follow vertical slice architecture

## Vertical Slice Architecture

Vertical slice architecture is an architectural approach that organizes code around features or "slices" of functionality rather than technical layers. Each slice contains all the components needed to implement a specific feature, from the UI to the data access layer.

### Key Principles

- **Feature-Centric Organization**: Code is organized by feature rather than by technical layer
- **Self-Contained Slices**: Each feature contains all necessary components (UI, business logic, data access)
- **Reduced Coupling**: Features are isolated from each other, minimizing cross-feature dependencies
- **Simplified Maintenance**: Changes to a feature are contained within its slice
- **Parallel Development**: Teams can work on different features simultaneously with minimal conflicts

### Our Implementation

In Solus, we implement vertical slice architecture as follows:

1. **Feature Organization**
   - Features are organized in dedicated directories (e.g., `/Decisions`, `/UserPreferences`, `/Dashboard`)
   - Each feature directory contains all related components, from UI to data access

2. **Directory Structure**

   ```js
   src/
   ├── Core/           # Shared core functionality
   │   ├── Auth/       # Authentication features
   │   ├── Layout/     # Layout components
   │   └── UI/         # Common UI components
   ├── Features/       # Feature slices
   │   ├── Decisions/  # Decision-making feature
   │   │   ├── components/  # UI components
   │   │   ├── hooks/       # Custom hooks
   │   │   ├── services/    # API and business logic
   │   │   ├── stores/      # State management
   │   │   └── types/       # TypeScript types
   │   ├── Dashboard/   # Dashboard feature
   │   └── Settings/    # User settings feature
   └── Shared/          # Truly cross-cutting concerns
       ├── /            # Shared components
       ├── utils/       # Utility functions
       └── types/       # Shared TypeScript types
   ```

3. **Dependency Flow**
   - Features can import from Core and Shared
   - Features should not import from other features
   - Core can import from Shared
   - Shared should not import from Features or Core

4. **State Management**
   - Each feature manages its own state
   - Global state is minimized and located in Shared/stores
   - Features expose APIs for other features to interact with them

5. **Benefits in Our Project**
   - Developers can understand a feature by looking at a single directory
   - New team members can focus on learning one feature at a time
   - Features can be developed, tested, and deployed independently
   - Code is more maintainable as changes are contained within feature boundaries
   - CI/CD pipelines can be optimized to only rebuild affected features

6. **Testing Strategy**
   - Tests are co-located with features
   - Each feature has its own test suite
   - Integration tests focus on feature boundaries
   - End-to-end tests cover complete user flows

By organizing our codebase around vertical slices, we achieve better separation of concerns, improved maintainability, and a codebase that better maps to the user experience of the application.
