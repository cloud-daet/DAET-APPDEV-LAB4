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
    sortMaterialsByQty() {
        this.materials.sort((a, b) => a.qty - b.qty);
        console.log("Materials sorted by quantity.");
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

    // Check Stock
    checkInventory() {
        let totalMaterials = this.materials.reduce((sum, m) => sum + m.qty, 0);
        console.log(`Total items in stock: ${totalMaterials}`);
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
    
    // Sort Laundry By Quantity
    sortLaundryByQty() {
        this.uncleanLaundry.sort((a, b) => a.qty - b.qty);
        this.cleanLaundry.sort((a, b) => a.qty - b.qty);
        console.log("Laundry sorted by quantity.");
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

function checkInventory() {
  console.log("\n=== FULL INVENTORY ===");
  MaterialInventory.displayMaterials();
  LaundryInventory.displayLaundry();
  MaterialInventory.checkInventory();
  LaundryInventory.checkLaundryInventory();
  console.log("========================\n");
}

// DOM HANDLERS
const laundryForm = document.getElementById("LaundryForm");
const searchInput = document.getElementById("searchInput");
const statusBtn = document.getElementById("statusBtn");
const deleteBtn = document.getElementById("deleteBtn");
const filterBtn = document.getElementById("filterBtn");
const laundrylistDiv = document.getElementById("laundrylist");
const matlistDiv = document.getElementById("matlist");

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
}

// Initial render
renderLaundryList();
renderMaterialList();

// Handle form submission to add laundry
laundryForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const clientName = document.getElementById("clientName").value;
    const totalKg = parseFloat(document.getElementById("totalKg").value);

    if (isNaN(totalKg) || totalKg <= 0) {
        alert("Please enter a valid number for weight.");
        return;
    }

    LaundryInventory.addLaundry(clientName, totalKg);
    laundryForm.reset();
    renderLaundryList();
});

// Marks laundry as clean
statusBtn.addEventListener("click", function() {
    const clientName = searchInput.value.trim();
    if (clientName==="") {
        alert("Please enter a client name to mark as clean.");
        return;
    }
    LaundryInventory.markLaundryAsClean(clientName);
    renderLaundryList();
});

// Deletes laundry entry
deleteBtn.addEventListener("click", function() {
    const clientName = searchInput.value.trim();
    if (clientName==="") {
        alert("Please enter a client name to delete.");
        return;
    }
    LaundryInventory.deleteLaundry(clientName);
    renderLaundryList();
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
    renderLaundryList();
});