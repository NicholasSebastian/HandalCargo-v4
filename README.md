# Handal Cargo v4

The fourth and hopefully final reiteration of PT. Handal Cargo's proprietary ERP system.

## To Do List

- [x] Feature: Abstractions for management of window and database connection processes.
- [ ] Fix: Find a better way to keep the connection alive.
- [x] Feature: Login Screen and Functionality.
- [ ] Feature: Encryption for passwords.
- [x] Feature: Layout for the main application window.
  - Header with Profile Button and Dropdown, etc.
  - Sidebar with navigation links.
- [x] Context wrapper for theme and languages.
- [x] Other: Add the color scheme for the dark theme.
- [ ] Other: Complete the localization translation map.
- [ ] Fix: Changing language or theme closes the currently open page.
- [ ] Fix: Closing a tab for the 'profile' page specifically opens the page.
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
- [ ] Fix: Change some components to PureComponents or useMemo to minimize dumb re-renders.

Note: List is still incomplete.
