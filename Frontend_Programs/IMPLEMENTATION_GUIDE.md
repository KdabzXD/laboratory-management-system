# Role-Based Access Implementation Guide

## Behavior for ALL Pages:

### Admin Mode (PIN: 12345678)
- ✅ Add/Edit/Delete buttons visible
- ✅ NO PIN required for any action
- ✅ **DELETE**: Show confirmation popup → Delete (no PIN)

### Editor Mode (PIN: 87654321)
- ✅ Add/Edit/Delete buttons visible  
- ✅ **EDIT**: Prompt PIN → Open edit form
- ✅ **DELETE**: Prompt PIN → Show confirmation popup → Delete

### Viewer Mode (No PIN)
- ✅ NO buttons visible
- ✅ Read-only access

## Delete Flow:

**Admin:**
1. Click Delete button
2. Show "Are you sure?" popup
3. Click Confirm → Delete

**Editor:**
1. Click Delete button
2. Show PIN entry modal
3. Enter correct PIN
4. Show "Are you sure?" popup
5. Click Confirm → Delete

## Currency Format:
- Equipment: KSh (already done)
- Materials: KSh (needs update - remove $)
- Purchases: KSh (needs update - remove $)

## Pages to Update:
1. ✅ Equipment - Add delete confirmation for Admin
2. ✅ Scientists - Full implementation
3. ✅ Materials - Full implementation + KSh
4. ✅ Suppliers - Full implementation
5. ✅ Purchases - Full implementation + KSh
