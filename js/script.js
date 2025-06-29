document.addEventListener('DOMContentLoaded', function() {
    // Count commands in each category and update the tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        const tabId = content.id;
        const commandCount = content.querySelectorAll('.command-card').length;
        const tabElement = document.querySelector(`.tabs li[data-tab="${tabId}"]`);
        
        // Add command count to tab
        const countSpan = document.createElement('span');
        countSpan.className = 'command-count';
        countSpan.textContent = commandCount;
        tabElement.appendChild(countSpan);
    });
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tabs li');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Save the active tab to localStorage
            localStorage.setItem('activeTab', tabId);
        });
    });
    
    // Check if there's a saved active tab in localStorage
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        // Activate the saved tab
        const tabToActivate = document.querySelector(`.tabs li[data-tab="${savedTab}"]`);
        if (tabToActivate) {
            tabToActivate.click();
        }
    }
    
    // Add copy functionality for command syntax
    document.querySelectorAll('.command-card').forEach(card => {
        const syntaxElement = card.querySelector('.syntax');
        const syntaxText = syntaxElement.textContent;
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy command';
        
        // Add click event to copy button
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(syntaxText)
                .then(() => {
                    // Temporarily change the icon to indicate success
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
        
        // Insert the copy button into the syntax element
        syntaxElement.appendChild(copyButton);
        
        // Add copy functionality for aliases
        const aliasElements = card.querySelectorAll('.alias');
        aliasElements.forEach(alias => {
            alias.addEventListener('click', () => {
                navigator.clipboard.writeText(alias.textContent);
                
                // Visual feedback for copy
                const originalBackground = alias.style.backgroundColor;
                alias.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                setTimeout(() => {
                    alias.style.backgroundColor = originalBackground;
                }, 500);
            });
            
            // Add title to indicate clickable
            alias.title = 'Click to copy alias';
            alias.style.cursor = 'pointer';
        });
    });
    
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search commands...';
    searchInput.className = 'search-input';
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.appendChild(searchInput);
    
    // Insert search box before the tabs
    const tabsContainer = document.querySelector('.tabs').parentElement;
    tabsContainer.insertBefore(searchContainer, document.querySelector('.tabs'));
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let hasResults = false;
        
        // Handle search mode
        if (searchTerm.length > 0) {
            // Hide tab navigation when searching
            document.querySelector('.tabs').style.display = 'none';
            
            // Add search results header
            let searchHeader = document.getElementById('search-header');
            if (!searchHeader) {
                searchHeader = document.createElement('h2');
                searchHeader.id = 'search-header';
                searchHeader.innerHTML = '<i class="fas fa-search"></i> Search Results';
                document.querySelector('main').insertBefore(searchHeader, document.querySelector('.tab-content'));
            }
            searchHeader.style.display = 'block';
            
            // Create search results container if it doesn't exist
            let searchResults = document.getElementById('search-results');
            if (!searchResults) {
                searchResults = document.createElement('div');
                searchResults.id = 'search-results';
                searchResults.className = 'search-results';
                document.querySelector('main').appendChild(searchResults);
            }
            
            // Clear previous search results
            searchResults.innerHTML = '';
            
            // Hide all tab content sections
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Find matching commands
            const matchingCommands = [];
            document.querySelectorAll('.command-card').forEach(card => {
                const commandName = card.querySelector('h3').textContent.toLowerCase();
                const commandDesc = card.querySelector('p').textContent.toLowerCase();
                
                // Also search in aliases if they exist
                let aliasText = '';
                const aliases = card.querySelectorAll('.alias');
                aliases.forEach(alias => {
                    aliasText += alias.textContent.toLowerCase() + ' ';
                });
                
                if (commandName.includes(searchTerm) || 
                    commandDesc.includes(searchTerm) || 
                    aliasText.includes(searchTerm)) {
                    // Clone the card and add to matching commands
                    matchingCommands.push(card.cloneNode(true));
                    hasResults = true;
                }
            });
            
            // Display matching commands in search results
            if (hasResults) {
                const resultsGrid = document.createElement('div');
                resultsGrid.className = 'commands-grid';
                matchingCommands.forEach(card => {
                    resultsGrid.appendChild(card);
                });
                searchResults.appendChild(resultsGrid);
                searchResults.style.display = 'block';
                
                // Add copy functionality to cloned cards
                searchResults.querySelectorAll('.command-card').forEach(card => {
                    const syntaxElement = card.querySelector('.syntax');
                    const syntaxText = syntaxElement.textContent;
                    
                    // Remove any existing copy buttons first
                    const existingButton = syntaxElement.querySelector('.copy-btn');
                    if (existingButton) {
                        existingButton.remove();
                    }
                    
                    // Create copy button
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-btn';
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.title = 'Copy command';
                    
                    // Add click event to copy button
                    copyButton.addEventListener('click', () => {
                        navigator.clipboard.writeText(syntaxText)
                            .then(() => {
                                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                                setTimeout(() => {
                                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                                }, 2000);
                            })
                            .catch(err => {
                                console.error('Failed to copy text: ', err);
                            });
                    });
                    
                    // Insert the copy button into the syntax element
                    syntaxElement.appendChild(copyButton);
                    
                    // Add copy functionality for aliases
                    const aliasElements = card.querySelectorAll('.alias');
                    aliasElements.forEach(alias => {
                        alias.addEventListener('click', () => {
                            navigator.clipboard.writeText(alias.textContent);
                            
                            // Visual feedback for copy
                            const originalBackground = alias.style.backgroundColor;
                            alias.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            setTimeout(() => {
                                alias.style.backgroundColor = originalBackground;
                            }, 500);
                        });
                        
                        // Add title to indicate clickable
                        alias.title = 'Click to copy alias';
                        alias.style.cursor = 'pointer';
                    });
                });
            }
            
            // Show no results message
            let noResultsMsg = document.getElementById('no-results-message');
            if (!hasResults) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'no-results-message';
                    noResultsMsg.className = 'no-results';
                    noResultsMsg.textContent = 'No commands found matching your search.';
                    document.querySelector('main').appendChild(noResultsMsg);
                }
                noResultsMsg.style.display = 'block';
                searchResults.style.display = 'none';
            } else if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        } else {
            // Exit search mode
            // Find the active tab
            const activeTabId = localStorage.getItem('activeTab') || 'moderation';
            const activeTab = document.querySelector(`.tabs li[data-tab="${activeTabId}"]`);
            
            // Ensure tab navigation is visible
            document.querySelector('.tabs').style.display = '';
            
            // Reset active status on tabs
            document.querySelectorAll('.tabs li').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Set active tab
            if (activeTab) {
                activeTab.classList.add('active');
            } else {
                // Default to first tab if active tab not found
                document.querySelector('.tabs li').classList.add('active');
            }
            
            // Hide all tab contents first
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Show the active tab content
            const activeContent = document.getElementById(activeTabId);
            if (activeContent) {
                activeContent.classList.add('active');
                activeContent.style.display = 'block';
            } else {
                // Default to first tab content if active not found
                const firstContent = document.querySelector('.tab-content');
                firstContent.classList.add('active');
                firstContent.style.display = 'block';
            }
            
            // Hide search header
            const searchHeader = document.getElementById('search-header');
            if (searchHeader) {
                searchHeader.style.display = 'none';
            }
            
            // Hide search results
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
            
            // Hide no results message
            const noResultsMsg = document.getElementById('no-results-message');
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
            
            // Reset display of all command cards in tabs
            document.querySelectorAll('.command-card').forEach(card => {
                card.style.display = '';
            });
            
            // Re-enable tab switching
            document.querySelectorAll('.tabs li').forEach(tab => {
                tab.style.pointerEvents = 'auto';
            });
        }
    });
}); 