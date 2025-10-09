// Maximum weight limit for laundry in kg
const MAX_WEIGHT = 7;

const MaterialInventory = {
    // Array to hold materials
    materials: [ 
        { name: "Detergent", qty: 20, price: 15 },
        { name: "Fabric Conditioner", qty: 20, price: 8 },
        { name: "Laundry Bag", qty: 20, price: 5 },
    ],

    // Display Materials in Table (console)
    displayMaterials() {
        console.log("Materials:");
        console.table(this.materials);
    },

    // Add New Material
    addMaterial(name, qty, price) {
        let newMaterial = {
            name: name,
            qty: qty,
            price: price
        };
        this.materials.push(newMaterial);
        console.log(`Added new material: ${name}, Quantity: ${qty}, Price: $${price}`);
    },

    // Add to existing Material
    addToMaterial(name, additionalQty) {
        let material = this.materials.find(m => m.name === name);
        if (material) {
            material.qty += additionalQty;
            console.log(`Updated ${name} quantity to +${additionalQty}`);
        } else {
            console.log(`Material ${name} not found.`);
        }  
    },

    // Update Material Quantity (used when laundry is processed)
    updateMaterialQty(name, usedQty) {
        let material = this.materials.find(m => m.name === name);
        if (material) {
            if (material.qty >= usedQty) {
                material.qty -= usedQty;
                console.log(`Used ${usedQty} of ${name}. New quantity: ${material.qty}`);
            } else {
                console.log(`Insufficient ${name} in stock. Available: ${material.qty}, Required: ${usedQty}`);
            }
        }
    },

    // Update Material Price
    updateMaterialPrice(name, newPrice) {
        let material = this.materials.find(m => m.name === name);
        if (material) {
            material.price = newPrice;
            console.log(`Updated ${name} price to $${newPrice}`);
        } else {
            console.log(`Material ${name} not found.`);
        }
    },

    // Delete Material
    deleteMaterial(name) {
        let index = this.materials.findIndex(m => m.name === name);
        if (index !== -1) {
            this.materials.splice(index, 1);
            console.log(`Deleted material: ${name}`);
        } else {
            console.log(`Material ${name} not found.`);
        }
    },

    // Sort Materials by Quantity
    sortMaterialsByQtyDOWN() {
        this.materials.sort((a, b) => b.qty - a.qty);
        console.log("Materials sorted by quantity (descending).");
    },

    sortMaterialsByQtyUP() {
        this.materials.sort((a, b) => a.qty - b.qty);
        console.log("Materials sorted by quantity (ascending).");
    },

    // Sort Materials by Name
    sortMaterialsByName() {
        this.materials.sort((a, b) => a.name.localeCompare(b.name));
        console.log("Materials sorted by name.");
    },

    // Sort Materials by Price  
    sortMaterialsByPriceDOWN() {
        this.materials.sort((a, b) => a.price - b.price);
        console.log("Materials sorted by price.");
    },

    sortMaterialsByPriceUP() {
        this.materials.sort((a, b) => b.price - a.price);
        console.log("Materials sorted by price.");
    },

    // Filter By Quantity
    filterMaterialsByQty(threshold) {
        let filtered = this.materials.filter(m => m.qty < threshold);
        console.log(`Materials with quantity less than ${threshold}:`);
        console.table(filtered);
    },

    // Filter By Name
    filterMaterialsByName(name) {
        let filtered = this.materials.filter(m => m.name.toLowerCase().includes(name.toLowerCase()));
        console.log(`Filtered Materials by name "${name}":`);
        console.table(filtered);
    },

    filterMaterialsByPrice(price) {
        let filtered = this.materials.filter(m => m.price <= price);
        console.log(`Materials with price less than or equal to ${price}:`);
        console.table(filtered);
    },

    // Check Stock
    checkInventory() {
        let totalItems = this.materials.length;
        console.log(`Total different items in stock: ${totalItems}`);
        let totalValue = this.materials.reduce((sum, m) => sum + (m.qty * m.price), 0);
        console.log(`Total inventory value: $${totalValue.toFixed(2)}`);
        let totalMaterials = this.materials.reduce((sum, m) => sum + m.qty, 0);
        console.log(`Total items in stock: ${totalMaterials}`);
        return [totalItems, totalMaterials, totalValue.toFixed(2)];
    },
};

const LaundryInventory = {
    uncleanLaundry: [], // Array to hold unclean laundry entries
    cleanLaundry: [],   // Array to hold clean laundry entries

    // Display Laundry in Table (console)
    displayLaundry() {
        console.log("Unclean Laundry:");
        console.table(this.uncleanLaundry);
        console.log("Clean Laundry:");
        console.table(this.cleanLaundry);
    },

    // Display specific laundry status
    displayLaundryByStatus(status) {
        if (status === "unclean") {
            console.log("Unclean Laundry:");
            console.table(this.uncleanLaundry);
        } else if (status === "clean") {
            console.log("Clean Laundry:");
            console.table(this.cleanLaundry);
        } else {
            console.log("Invalid status. Use 'unclean' or 'clean'.");
        }
    },

    // Add New Laundry
    addLaundry(clientName, totalKg) {
        let bags = Math.ceil(totalKg / MAX_WEIGHT); // round up any remainder
    this.uncleanLaundry.push({ clientName, kilos: totalKg, qty: bags, status: "Pending" });
    console.log(`${clientName}'s laundry, ${totalKg}kg (${bags} bag/s) added.`);
    },

    // Mark Laundry as Clean
    markLaundryAsClean(clientName) {
        let laundry = this.uncleanLaundry.find(l => l.clientName === clientName);
        if (!laundry) {
            console.log(`No pending laundry found for ${clientName}.`);
            alert(`No pending laundry found for ${clientName}.`);
            return;
        }

        // Check stock availability using MaterialInventory
        const detergent = MaterialInventory.materials.find(m => m.name === "Detergent");
        const fabcon = MaterialInventory.materials.find(m => m.name === "Fabric Conditioner");
        const bag = MaterialInventory.materials.find(m => m.name === "Laundry Bag");

        if (
            !detergent || detergent.qty < laundry.qty ||
            !fabcon || fabcon.qty < laundry.qty * 2 ||
            !bag || bag.qty < laundry.qty
        ) {
            console.log(`Not enough materials to clean ${clientName}'s laundry.`);
            return;
        }

        // Deduct materials
        MaterialInventory.updateMaterialQty("Detergent", laundry.qty);
        MaterialInventory.updateMaterialQty("Fabric Conditioner", laundry.qty * 2);
        MaterialInventory.updateMaterialQty("Laundry Bag", laundry.qty);

        // Move laundry to clean list
        this.cleanLaundry.push({ clientName, kilos: laundry.kilos, qty: laundry.qty, status: "Cleaned" });
        this.uncleanLaundry = this.uncleanLaundry.filter(l => l.clientName !== clientName);
        console.log(`${clientName}'s laundry marked as cleaned.`);
    },

    // Delete Laundry Entry
    deleteLaundry(clientName) {
        this.uncleanLaundry = this.uncleanLaundry.filter(l => l.clientName !== clientName);
        this.cleanLaundry = this.cleanLaundry.filter(l => l.clientName !== clientName);
        console.log(`${clientName}'s laundry entry deleted.`);
    },

    // Sort Laundry By Client Name
    sortLaundryByClientName() {
        this.uncleanLaundry.sort((a, b) => a.clientName.localeCompare(b.clientName));
        this.cleanLaundry.sort((a, b) => a.clientName.localeCompare(b.clientName));
        console.log("Laundry sorted by client name.");
    },
    
    // Sort Laundry By Quantity Descending
    sortLaundryByQtyDOWN() {
        this.uncleanLaundry.sort((a, b) => a.qty - b.qty);
        this.cleanLaundry.sort((a, b) => a.qty - b.qty);
        console.log("Laundry sorted by quantity. Descending.");
    },

    // Sort Laundry By Quantity Ascending
    sortLaundryByQtyUP() {
        this.uncleanLaundry.sort((a, b) => b.qty - a.qty);
        this.cleanLaundry.sort((a, b) => b.qty - a.qty);
        console.log("Laundry sorted by quantity. Ascending.");
    },
    
    // Sort Laundry By Status
    sortLaundryByStatus() {
        this.uncleanLaundry.sort((a, b) => a.status.localeCompare(b.status));
        this.cleanLaundry.sort((a, b) => a.status.localeCompare(b.status));
        console.log("Laundry sorted by status.");
    },

    // Filter Laundry By Client Name
    filterLaundryByName(clientName) {
        let filteredUnclean = this.uncleanLaundry.filter(l => l.clientName.toLowerCase().includes(clientName.toLowerCase()));
        let filteredClean = this.cleanLaundry.filter(l => l.clientName.toLowerCase().includes(clientName.toLowerCase()));
        console.log(`Filtered Unclean Laundry by client name "${clientName}":`);
        console.table(filteredUnclean);
        console.log(`Filtered Clean Laundry by client name "${clientName}":`);
        console.table(filteredClean);
    },

    // Filter Laundry By Quantity
    filterLaundryByQty(threshold) {
        let filteredUnclean = this.uncleanLaundry.filter(l => l.qty <= threshold);
        let filteredClean = this.cleanLaundry.filter(l => l.qty <= threshold);
        console.log(`Filtered Unclean Laundry with quantity less than or equal ${threshold}:`);
        console.table(filteredUnclean);
        console.log(`Filtered Clean Laundry with quantity less than or equal ${threshold}:`);
        console.table(filteredClean);
    },

    // Display Laundry Inventory Count
    checkLaundryInventory() {
        let totalUnclean = this.uncleanLaundry.reduce((sum, l) => sum + l.qty, 0);
        let totalClean = this.cleanLaundry.reduce((sum, l) => sum + l.qty, 0);
        console.log(`Total unclean laundry bags: ${totalUnclean}`);
        console.log(`Total clean laundry bags: ${totalClean}`);
        return [totalUnclean, totalClean, totalUnclean + totalClean];
    },

    // Checkout Cleaned Laundry
    checkoutLaundry(clientName) {
        const laundry = this.cleanLaundry.find(l => l.clientName === clientName);
        if (!laundry) {
            console.log(`No cleaned laundry found for ${clientName}.`);
            return;
        }

        // Prices
        const WASH_PRICE = 65;
        const DRY_PRICE = 65;
        const FOLD_PRICE = 30;
        const SERVICE_FEE_PER_BAG = 196;

        // Cycles (1 wash + 1 dry per bag)
        const washCycles = laundry.qty;
        const dryCycles = laundry.qty;
        const washTotal = washCycles * WASH_PRICE;
        const dryTotal = dryCycles * DRY_PRICE;
        const foldTotal = laundry.qty * FOLD_PRICE;

        // Materials used
        const detergentUsed = laundry.qty;
        const fabconUsed = laundry.qty * 2;
        const bagUsed = laundry.qty;

        // Get material prices
        const detergent = MaterialInventory.materials.find(m => m.name === "Detergent");
        const fabcon = MaterialInventory.materials.find(m => m.name === "Fabric Conditioner");
        const bag = MaterialInventory.materials.find(m => m.name === "Laundry Bag");

        const detergentPrice = detergent ? detergent.price * detergentUsed : 0;
        const fabconPrice = fabcon ? fabcon.price * fabconUsed : 0;
        const bagPrice = bag ? bag.price * bagUsed : 0;

        // Service fee
        const serviceFee = laundry.qty * SERVICE_FEE_PER_BAG;

        // Total price
        const totalPrice = washTotal + dryTotal + foldTotal + detergentPrice + fabconPrice + bagPrice + serviceFee;

        // Output breakdown
        console.log(`--- Checkout for ${clientName} ---`);
        console.log(`Laundry Bags: ${laundry.qty} (max 7kg each)`);
        console.log(`Wash Cycles: ${washCycles} x Php ${WASH_PRICE} = Php ${washTotal}`);
        console.log(`Dry Cycles: ${dryCycles} x Php ${DRY_PRICE} = Php ${dryTotal}`);
        console.log(`Fold Service: ${laundry.qty} x Php ${FOLD_PRICE} = Php ${foldTotal}`);
        console.log(`Detergent Used: ${detergentUsed} x Php ${detergent ? detergent.price : 0} = Php ${detergentPrice}`);
        console.log(`Fabric Conditioner Used: ${fabconUsed} x Php ${fabcon ? fabcon.price : 0} = Php ${fabconPrice}`);
        console.log(`Laundry Bags Used: ${bagUsed} x Php ${bag ? bag.price : 0} = Php ${bagPrice}`);
        console.log(`Service Fee: ${laundry.qty} x Php ${SERVICE_FEE_PER_BAG} = Php ${serviceFee}`);
        console.log(`TOTAL: Php ${totalPrice}`);
        console.log('-----------------------------');
    }
};

// for testing in console, prolly deprecated
function checkInventory() {
  console.log("\n=== FULL INVENTORY ===");
  MaterialInventory.displayMaterials();
  LaundryInventory.displayLaundry();
  MaterialInventory.checkInventory();
  LaundryInventory.checkLaundryInventory();
  console.log("========================\n");
} 

// --- DOM CONSTANTS ---

//LAUNDRY INVENTORY CONSTANTS
const laundryForm = document.getElementById("LaundryForm");
const searchInput = document.getElementById("searchInput");
const statusBtn = document.getElementById("statusBtn");
const deleteBtn = document.getElementById("deleteBtn");
const filterBtn = document.getElementById("filterBtn");
const sortClientBtn = document.getElementById("sortNameBtn");
const sortQtyBtn = document.getElementById("sortQtyBtn");
// const sortStatusBtn = document.getElementById("sortStatusBtn");
const laundrylistDiv = document.getElementById("laundrylist");
const totalEntriesSpan = document.getElementById("totalEntries");
const totalUncleanSpan = document.getElementById("totalUnclean");
const totalCleanSpan = document.getElementById("totalClean");

//MATERIAL INVENTORY CONSTANTS
const matForm = document.getElementById("MaterialForm");
const matSearchInput = document.getElementById("mat_searchInput");
const matDeleteBtn = document.getElementById("mat_deleteBtn");
const matFilterBtn = document.getElementById("mat_filterBtn");
const matSearchInput2 = document.getElementById("mat_searchInput2");
const matNumInput = document.getElementById("mat_numInput");
const matUpdatePrcBtn = document.getElementById("updPriceBtn");
const matAddToBtn = document.getElementById("addToBtn");
const matSortNameBtn = document.getElementById("mat_sortNameBtn");
const matSortQtyBtn = document.getElementById("mat_sortQtyBtn");
const matSortPrcBtn = document.getElementById("mat_sortPrcBtn");
const totalItemsSpan = document.getElementById("mat_totalItems");
const totalQtySpan = document.getElementById("mat_totalQty");
const totalValueSpan = document.getElementById("mat_totalValue");
const matlistDiv = document.getElementById("matlist");

// --- RENDER FUNCTIONS ---
function renderLaundryList() {
    laundrylistDiv.innerHTML = ""; // Clear existing content
    function createTable(title, laundryArray) {
        if (laundryArray.length === 0) {
            return `<h3>${title}</h3><p>No entries.</p>`;
        }
        let tableHTML = `<h3>${title}</h3>`;
        tableHTML += `
            <table border="1">
            <tr>
                <th>Client Name</th>
                <th>Kilos</th>
                <th>Quantity (bags)</th>
                <th>Status</th>
            </tr>
        `;
        laundryArray.forEach(laundry => {
            tableHTML += `
                <tr>
                    <td>${laundry.clientName}</td>
                    <td>${laundry.kilos}</td>
                    <td>${laundry.qty}</td>
                    <td>${laundry.status}</td>
                </tr>
            `;
        });

        tableHTML += `</table>`;
        return tableHTML;
    }

    // Build both tables
    const uncleanTable = createTable("🧺 Unclean Laundry", LaundryInventory.uncleanLaundry);
    const cleanTable = createTable("✅ Clean Laundry", LaundryInventory.cleanLaundry);
    laundrylistDiv.innerHTML = uncleanTable + "<br>" + cleanTable;
    LaundryInventory.displayLaundry();
}

function renderMaterialList() {
    matlistDiv.innerHTML = ""; // Clear existing content
    function createTable(title, itemArray) {
        if (itemArray.length === 0) {
            return `<h3>${title}</h3><p>No entries.</p>`;
        }
        let tableHTML = `<h3>${title}</h3>`;
        tableHTML += `
            <table border="1">
            <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price (Php)</th>
            </tr>
        `;
        itemArray.forEach(item => {
            tableHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${item.price}</td>
                </tr>
            `;
        });

        tableHTML += `</table>`;
        return tableHTML;
    }

    // Build both tables
    const matTable = createTable("🧴 Materials", MaterialInventory.materials);
    matlistDiv.innerHTML = matTable;
    MaterialInventory.displayMaterials();
}

// --- UPDATE SUMMARY ---
function updateLaundrySummary() {
    const [totalUnclean, totalClean, totalEntries] = LaundryInventory.checkLaundryInventory();
    totalEntriesSpan.textContent = totalEntries;
    totalUncleanSpan.textContent = totalUnclean;
    totalCleanSpan.textContent = totalClean;
}

function updateMaterialSummary() {
    const [totalItems, totalQty, totalValue] = MaterialInventory.checkInventory();
    totalItemsSpan.textContent = totalItems;
    totalQtySpan.textContent = totalQty;
    totalValueSpan.textContent = totalValue;
}

function renderAll() {
    renderLaundryList();
    renderMaterialList();
    updateLaundrySummary();
    updateMaterialSummary();
}

// Initial render
renderLaundryList();
renderMaterialList();
updateLaundrySummary();
updateMaterialSummary();

// --- LAUNDRY EVENTS ---

// Handle form submission to add laundry
laundryForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const clientName = document.getElementById("clientName").value;
    const totalKg = parseFloat(document.getElementById("totalKg").value);

    if (isNaN(totalKg) || totalKg <= 0) {
        alert("Please enter a valid number for weight.");
        return;
    } else if (clientName.trim() === "") {
        alert("Please enter a client name.");
        return;
    }

    LaundryInventory.addLaundry(clientName, totalKg);
    laundryForm.reset();
    renderAll();
});

// Marks laundry as clean
statusBtn.addEventListener("click", function() {
    const clientName = searchInput.value.trim();
    if (clientName==="") {
        alert("Please enter a client name to mark as clean.");
        return;
    }
    LaundryInventory.markLaundryAsClean(clientName);
    renderAll();
});

// Deletes laundry entry
deleteBtn.addEventListener("click", function() {
    const clientName = searchInput.value.trim();
    if (clientName==="") {
        alert("Please enter a client name to delete.");
        return;
    }
    LaundryInventory.deleteLaundry(clientName);
    renderAll();
});

// Filters laundry by name or quantity (bags)
filterBtn.addEventListener("click", function() {
    const query = searchInput.value.trim();
    if (query==="") {
        alert("Please enter a something to filter.");
        return;
    }

    const queryNum = parseInt(query);
    if (!isNaN(queryNum)) {
        LaundryInventory.filterLaundryByQty(queryNum);
    } else {
        LaundryInventory.filterLaundryByName(query);
    }
    renderAll();
});

// Sort by Client Name
sortClientBtn.addEventListener("click", function() {
    LaundryInventory.sortLaundryByClientName();
    renderAll();
});

// Sort by Quantity, Toggle Asc/Desc
sortQtyBtn.addEventListener("click", function() {
    if (sortQtyBtn.textContent === "Sort by Quantity ▲") { 
        LaundryInventory.sortLaundryByQtyDOWN();
        sortQtyBtn.textContent = "Sort by Quantity ▼";
    } else {
        LaundryInventory.sortLaundryByQtyUP();
        sortQtyBtn.textContent = "Sort by Quantity ▲";
    }
    renderAll();
});

// --- MATERIAL EVENTS ---
// Handle form submission to add material
matForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const itemName = document.getElementById("itemName").value.trim();
    const itemQty = parseInt(document.getElementById("itemQty").value);
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);

    if (itemName === "") {
        alert("Please enter an item name.");
        return;
    }

    if (isNaN(itemQty) || itemQty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }  

    if (isNaN(itemPrice) || itemPrice <= 0) {
        alert("Please enter a valid price.");
        return;
    }
    // Check if item already exists
    const existingItem = MaterialInventory.materials.find(m => m.name.toLowerCase() === itemName.toLowerCase());
    if (existingItem) {
        MaterialInventory.addToMaterial(existingItem.name, itemQty);
        MaterialInventory.updateMaterialPrice(existingItem.name, itemPrice);
    } else {
        MaterialInventory.addMaterial(itemName, itemQty, itemPrice);
    }
    matForm.reset();
    renderAll();
});

// Deletes material entry
matDeleteBtn.addEventListener("click", function() {
    const itemName = matSearchInput.value.trim();
    if (itemName === "") {
        alert("Please enter an item name to delete.");
        return;
    }
    MaterialInventory.deleteMaterial(itemName);
    renderAll();
    itemName.reset;
});

// Filters material by name, quantity, or price
matFilterBtn.addEventListener("click", function() {
    const query = matSearchInput.value.trim();
    if (query === "") {
        alert("Please enter something to filter.");
        return;
    }
    const queryNum = parseInt(query);
    const queryFloat = parseFloat(query);
    if (!isNaN(queryNum)) {
        if (queryNum !== queryFloat) {
            alert("Filtering by price (decimal) instead of quantity (whole number).");
            MaterialInventory.filterMaterialsByPrice(queryFloat);
        } else {
            alert("Filtering by quantity (whole number).");
            MaterialInventory.filterMaterialsByQty(queryNum);
        }
    } else {
        MaterialInventory.filterMaterialsByName(query);
    }
    renderAll();
});

// Updates material price
matUpdatePrcBtn.addEventListener("click", function() {
    const itemName = matSearchInput2.value.trim();
    const newPrice = parseFloat(matNumInput.value);
    if (itemName === "") {
        alert("Please enter an item name to update.");
        return;
    }
    if (isNaN(newPrice) || newPrice <= 0) {
        alert("Please enter a valid price.");
        return;
    }
    MaterialInventory.updateMaterialPrice(itemName, newPrice);
    renderAll();
    matForm.reset();
});

// Adds quantity to existing material
matAddToBtn.addEventListener("click", function() {
    const itemName = matSearchInput2.value.trim();
    const additionalQty = parseInt(matNumInput.value);
    if (itemName === "") {
        alert("Please enter an item name to add to.");
        return;
    }
    if (isNaN(additionalQty) || additionalQty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }
    MaterialInventory.addToMaterial(itemName, additionalQty);
    renderAll();
    matForm.reset();
});

// Sort by Name
matSortNameBtn.addEventListener("click", function() {
    MaterialInventory.sortMaterialsByName();
    renderAll();
});

// Sort by Quantity, Toggle Asc/Desc
matSortQtyBtn.addEventListener("click", function() {
    if (matSortQtyBtn.textContent === "Sort by Quantity ▲") {
        MaterialInventory.sortMaterialsByQtyDOWN();
        matSortQtyBtn.textContent = "Sort by Quantity ▼";
    } else {
        MaterialInventory.sortMaterialsByQtyUP();
        matSortQtyBtn.textContent = "Sort by Quantity ▲";
    }
    renderAll();
});

// Sort by Price, Toggle Asc/Desc
matSortPrcBtn.addEventListener("click", function() {
    if (matSortPrcBtn.textContent === "Sort by Price ▲") {
        MaterialInventory.sortMaterialsByPriceDOWN();
        matSortPrcBtn.textContent = "Sort by Price ▼";
    } else {
        MaterialInventory.sortMaterialsByPriceUP();
        matSortPrcBtn.textContent = "Sort by Price ▲";
    }
    renderAll();
});

// da caffeine aint helping no more
// overclocked my brain