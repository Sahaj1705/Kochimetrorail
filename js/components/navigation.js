@@ .. @@
         this.setupDropdowns();
         this.setupMobileMenu();
+        this.setupSubPageNavigation();
         
         this.isInitialized = true;
         this.logInfo('Navigation manager initialized');
@@ .. @@
         });
     }

+    /**
+     * Set up sub-page navigation for Operations and Reports
+     */
+    setupSubPageNavigation() {
+        // Handle dropdown item clicks
+        const dropdownItems = document.querySelectorAll('.nav-dropdown-item[data-tab]');
+        dropdownItems.forEach(item => {
+            item.addEventListener('click', (e) => {
+                e.preventDefault();
+                const tabName = item.dataset.tab;
+                if (tabName && window.metroApp) {
+                    window.metroApp.handleTabChange(tabName);
+                    // Close dropdown after selection
+                    const dropdown = item.closest('.nav-dropdown');
+                    if (dropdown) {
+                        dropdown.classList.remove('show');
+                        const button = dropdown.querySelector('.nav-item');
+                        if (button) {
+                            button.setAttribute('aria-expanded', 'false');
+                        }
+                    }
+                }
+            });
+        });
+    }
+
     /**
      * Set up dropdown menus
      */
     setupDropdowns() {
-        const dropdown = document.getElementById('reports-dropdown');
-        if (!dropdown) return;
+        const dropdowns = document.querySelectorAll('.nav-dropdown');
+        dropdowns.forEach(dropdown => {
+            const button = dropdown.querySelector('.nav-item');
+            if (!button) return;

-        const button = dropdown.querySelector('.nav-item');
-        if (!button) return;
-
-        button.addEventListener('click', (e) => {
-            e.preventDefault();
-            this.toggleDropdown(dropdown);
+            button.addEventListener('click', (e) => {
+                e.preventDefault();
+                this.toggleDropdown(dropdown);
+            });
         });

         // Close dropdowns when clicking outside
         document.addEventListener('click', (e) => {
-            if (!dropdown.contains(e.target)) {
-                this.closeDropdown(dropdown);
-            }
+            dropdowns.forEach(dropdown => {
+                if (!dropdown.contains(e.target)) {
+                    this.closeDropdown(dropdown);
+                }
+            });
         });
     }