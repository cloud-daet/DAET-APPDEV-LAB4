// Maximum weight limit for laundry in kg
const MAX_WEIGHT = 7;

const MaterialInventory = {
    // Array to hold materials
    materials: [ 
        { name: "Detergent", qty: 20, price: 15 },
        { name: "Fabric Conditioner", qty: 20, price: 5 },
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

    
};

