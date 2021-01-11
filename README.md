# Handal Cargo v4

The fourth and hopefully final reiteration of PT. Handal Cargo's proprietary ERP system.

## To Do List

- [x] Feature: Abstractions for management of window and database connection processes.
- [ ] Fix: Find a better way to keep the connection alive.
- [x] Feature: Login Screen and Functionality.
- [ ] Feature: Encryption for passwords.
- [ ] Fix: According to [this link](https://stackoverflow.com/questions/47875097/add-element-to-a-state-react), JSX should not be stored in nor rendered from state. Hence, the Login page should be rewritten with respect to good practice.
- [x] Feature: Layout for the main application window.
  - Header with Profile Button and Dropdown, etc.
  - Sidebar with navigation links.
- [x] Context wrapper for theme and languages.
- [x] Other: Add the color scheme for the dark theme.
- [ ] Other: Complete the localization translation map.
- [ ] Fix: Changing language or theme closes the currently open page.
- [ ] Fix: Closing a tab also routes to the page.
- [ ] Feature: Lock the sidebar links according to access level.
  - L1: Shipping and References Page.
  - L2: L1 + Reports Page.
  - L3: L2 + Master and Settings Page.
- [x] Feature: Tabs
- [ ] Fix: Switch to '/' page when closing the currently open tab.
- [ ] Content: Templates for all the pages.
  - Complex Template for 'Shipping' pages and 'Staff' page.
  - Simple Template for 'References' pages and 'Staff Groups' page.
- [ ] Fix: Template states apparently causes a memory leak??
- [ ] Content: All the pages.
  - UI tables for each table in the database.
  - Add, modify, delete functionality.
  - Form Validation.
  - Search and filter functionality.
- [ ] Content: Dashboard
- [ ] Content: Payroll???
- [ ] Feature: Formatted PDF report generation, printing functionality.
- [ ] Feature: Welcome screen varies depending on access level.
  - L1: Welcome screen.
  - L2/L3: Dashboard.
- [ ] Feature: Header utilities (e.g. calculator and notes)
- [ ] Feature: Basic email.
- [ ] Other: Change the image on the login page.
- [ ] Feature: Write/read data to/from a JSON file for local database connection settings.
- [ ] Other: Figure out a way to backup/restore database outside of cPanel.
- [ ] Other: Optimization - Change some components to PureComponents or React.memo to minimize dumb re-renders.
- [x] Other: Display the loading animation in between route changes.
- [ ] Other: Application icon.

Note: List is still incomplete.
