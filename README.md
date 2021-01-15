# Handal Cargo v4

The fourth and hopefully final reiteration of PT. Handal Cargo's proprietary ERP system.

## To Do List

- [x] Abstractions for management of window and database connection processes.
- [x] Login Screen and Functionality.
  - [x] Loading transition.
- [ ] Encryption for passwords.
- [x] Layout for the main application window.
  - [x] Header with Profile Button and Dropdown, etc.
  - [x] Sidebar with navigation links.
  - [x] Tabs and Page Headers
- [x] Context wrapper for theme and languages.
- [ ] Lock the sidebar links according to access level.
  - L1: Shipping and References Page.
  - L2: L1 + Reports Page.
  - L3: L2 + Master and Settings Page.
- [ ] Templates
  - [x] Complex Template for 'Shipping' pages and 'Staff' page.
    - [x] Table
    - [x] Delete functionality.
    - [x] Search and filter.
    - [x] Forms
      - [x] Form Validation.
      - [x] Add functionality.
      - [x] View functionality.
      - [x] Edit functionality.
      - [x] Form Components
        - [x] Headers
        - [x] Text input boxes
        - [x] ComboBox
        - [x] Date Picker
  - [ ] Simple Template for 'References' pages and 'Staff Groups' page.
    - [ ] List
    - [ ] Add, Modify, Delete.
- [x] Welcome screen
  - [x] '/' page varies depending on access level.
    - L1: Welcome screen.
    - L2/L3: Dashboard.
- [ ] Pages
  - [ ] Shipping
    - [ ] Sea Freight
    - [ ] Air Cargo
    - [ ] Invoice Entry
    - [ ] Payment
    - [ ] Customers
  - [ ] References
    - etcetra...
  - [ ] Reports
    - [ ] Dashboard
    - [ ] Payroll???
  - [ ] Master
    - [ ] Staff
      - [ ] Profile images
    - [ ] Staff Groups
    - [ ] Access Levels
    - [ ] Company Setup
  - [ ] Settings
    - [ ] Database Setup
    - [ ] Backup and Restore
- [ ] Formatted PDF report generation, printing functionality.
- [ ] Header utilities (e.g. calculator and notes)
- [ ] Basic email.
- [ ] Write/read data to/from a JSON file for local database connection settings.

## Miscellaneous Tasks

- [ ] Transition animations??
- [x] Dark Theme color scheme.
- [ ] Localization translation map.
- [x] Login page image.
- [ ] Figure out a way to backup/restore database outside of cPanel.
- [x] Display the loading animation in between route changes.
- [ ] Application icon.
- [ ] Optimization: Change some components to PureComponents or React.memo to minimize dumb re-renders.
- [ ] Optimization: Rewrite template components to use the Higher Order Components (HOC) design pattern.
- [ ] Improve the 'feeling' of the app.
  - UI/UX adjustments?
  - Alleviate blinks between page transitions:
    - Performance improvements?
    - Smoother transitions?
- [ ] Custom styled components??
  - [ ] Styled combobox
  - [ ] Styled date picker
  - [ ] Styled checkbox

## Currently known problems to be fixed

- [ ] Fix table edit and delete panel on hover.
- [ ] Electron's setMinimumSize is bugged / not working.
- [x] Connection with database timeouts and ends on its own (ECONNRESET).
- [ ] According to [this link](https://stackoverflow.com/questions/47875097/add-element-to-a-state-react), Components should not be stored in nor rendered from state. Hence, the Login page should be rewritten with respect to good practice.
- [ ] Changing language or theme closes the currently open page.
- [ ] Closing a tab also routes to the page.
- [ ] Should route to '/' page when closing the currently open tab but blinks out immediately instead.
- [x] Template states cause memory leaks.
- [ ] Changing languages does not change already open titles and tab labels.

Note: List is still incomplete.
