# Settings Page Documentation

## Overview

The Settings page (`app/dashboard/settings/page.tsx`) is a component of the Koinon application, providing users with the ability to view their account information.

## Features

### Account Information

- Displays the currently logged-in user's full name.
- Displays the user's email address.

## Technical Details

### Component Structure

The page is built using a single main component `SettingsPage` which utilizes several UI components from the `components/ui` directory:

- `Card`: For displaying account information.
- `Label`: For field labels.

### State Management

The component uses the authentication context to access the current user's information.
