# Handal Cargo v4

The fourth and hopefully final reiteration of PT. Handal Cargo's proprietary ERP system.

## To Do List

- [x] Abstractions for management of window and database connection processes.
- [x] Login Screen and Functionality.
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
    - [x] Add, Modify, Delete.
    - [x] Search and filter.
    - [x] Forms
      - [ ] Form Validation.
  - [ ] Simple Template for 'References' pages and 'Staff Groups' page.
    - [ ] List
    - [ ] Add, Modify, Delete.
- [ ] Pages
- [x] Welcome screen
  - [ ] '/' page varies depending on access level.
    - L1: Welcome screen.
    - L2/L3: Dashboard.
- [ ] Dashboard
- [ ] Payroll???
- [ ] Formatted PDF report generation, printing functionality.
- [ ] Header utilities (e.g. calculator and notes)
- [ ] Basic email.
- [ ] Write/read data to/from a JSON file for local database connection settings.

## Miscellaneous Tasks

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

## Currently known problems to be fixed

- [x] Find a better way to keep the connection alive.
- [ ] According to [this link](https://stackoverflow.com/questions/47875097/add-element-to-a-state-react), Components should not be stored in nor rendered from state. Hence, the Login page should be rewritten with respect to good practice.
- [ ] Changing language or theme closes the currently open page.
- [ ] Closing a tab also routes to the page.
- [ ] Should route to '/' page when closing the currently open tab but blinks out immediately instead.
- [x] Template states cause memory leaks.

Note: List is still incomplete.
