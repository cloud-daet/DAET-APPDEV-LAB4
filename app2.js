// Maximum weight limit for laundry in kg
const MAX_WEIGHT = 7;

const MaterialInventory = {
    materials: [ // Array to hold materials
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

