// PROBLEM 1
// Arrays to hold data
let materials = [ // Array to hold materials
  { name: "Detergent", qty: 20, price: 15 },
  { name: "Fabric Conditioner", qty: 20, price: 5 },
  { name: "Laundry Bag", qty: 20, price: 5 },
];
let cleanLaundry = []; // Array to hold clean laundry
let uncleanLaundry = []; // Array to hold unclean laundry

// Maximum weight limit for laundry in kg
const MAX_WEIGHT = 7;

// Display Materials in Table (console)
function displayMaterials() {
    console.log("Materials:");
    console.table(materials);
}

// Display Laundry Status (console)
function displayLaundryStatus() {
    console.log("Unclean/Pending Laundry:");
    console.table(uncleanLaundry);
    console.log("Clean Laundry:");
    console.table(cleanLaundry);
}

// Check Inventory Status (Summary)
function checkInventory() {
    console.log("=== INVENTORY CHECK ==="); // Header for clarity

    displayMaterials();
    displayLaundryStatus();

    let totalMaterials = materials.reduce((sum, m) => sum + m.qty, 0);
    console.log(`Total items in stock: ${totalMaterials}`);

    let totalUnclean = uncleanLaundry.reduce((sum, l) => sum + l.qty, 0);
    console.log(`Total unclean laundry bags: ${totalUnclean}`);

    let totalClean = cleanLaundry.reduce((sum, l) => sum + l.qty, 0);
    console.log(`Total clean laundry bags: ${totalClean}`);
    console.log("=======================");
}

// Add New Material
function addMaterial(name, qty, price) {
    let newMaterial = {
        name: name,
        qty: qty,
        price: price
    };
    materials.push(newMaterial);
    console.log(`Added new material: ${name}, Quantity: ${qty}, Price: $${price}`);
}

// Add to exsisting Material
function addToMaterial(name, additionalQty) {
    let material = materials.find(m => m.name === name);
    if (material) {
        material.qty += additionalQty;
        console.log(`Updated ${name} quantity to +${additionalQty}`);
    } else {
        console.log(`Material ${name} not found.`);
    }  
}
// Add New Laundry
function addLaundry(clientName, totalKg) {
    let bags = Math.ceil(totalKg / MAX_WEIGHT); // round up any remainder
    uncleanLaundry.push({ clientName, qty: bags, status: "Pending" });
    console.log(`${clientName}'s laundry (${bags} bag/s) added.`);
}

// Update Material Quantity
function updateMaterialQty(name, newQty) {
  let material = materials.find(m => m.name === name);
  if (material) {
    material.qty = newQty;
    console.log(`${name} stock updated to ${newQty}.`);
  } else {
    console.log(`Material ${name} not found.`);
  }
}

// Mark Laundry as Cleaned
function markAsClean(clientName) {
    let laundry = uncleanLaundry.find(l => l.clientName === clientName);
    if (!laundry) {
        console.log(`No pending laundry found for ${clientName}.`);
        return;
    }
    // Check stock availability
    if (
        materials[0].qty < laundry.qty ||
        materials[1].qty < laundry.qty * 2 ||
        materials[2].qty < laundry.qty
    ) {
        console.log(`Not enough materials to clean ${clientName}'s laundry.`);
        return;
    }

    // Deduct materials
    materials[0].qty -= laundry.qty; // Detergent
    materials[1].qty -= laundry.qty * 2; // Fabric Conditioner x2
    materials[2].qty -= laundry.qty; // Laundry Bag

    // Move laundry to clean list
    cleanLaundry.push({ clientName, qty: laundry.qty, status: "Cleaned" });
    uncleanLaundry = uncleanLaundry.filter(l => l.clientName !== clientName);
    console.log(`${clientName}'s laundry marked as cleaned.`);
}

// Delete Material
function deleteMaterial(name) {
    let index = materials.findIndex(m => m.name === name);
    if (index !== -1) {
        materials.splice(index, 1);
        console.log(`${name} material deleted.`);
    } else {
        console.log(`${name} not found.`);
    }
}

// Delete Laundry Entry
function deleteLaundry(clientName) {
    uncleanLaundry = uncleanLaundry.filter(l => l.clientName !== clientName);
    cleanLaundry = cleanLaundry.filter(l => l.clientName !== clientName);
    console.log(`${clientName}'s laundry entry deleted.`);
}

// Sort Materials By Quantity
function sortMaterialsByQty() {
    materials.sort((a, b) => a.qty - b.qty);
    console.log("Materials sorted by quantity.");
}

// Sort Laundry By Client Name
function sortLaundryByClientName() {
    uncleanLaundry.sort((a, b) => a.clientName.localeCompare(b.clientName));
    cleanLaundry.sort((a, b) => a.clientName.localeCompare(b.clientName));
    console.log("Laundry sorted by client name.");
}

// Sort Laundry By Quantity
function sortLaundryByQty() {
    uncleanLaundry.sort((a, b) => a.qty - b.qty);
    cleanLaundry.sort((a, b) => a.qty - b.qty);
    console.log("Laundry sorted by quantity.");
}

// Sort Laundry By Status
function sortLaundryByStatus() {
    uncleanLaundry.sort((a, b) => a.status.localeCompare(b.status));
    cleanLaundry.sort((a, b) => a.status.localeCompare(b.status));
    console.log("Laundry sorted by status.");
}

// Filter Materials By Name
function filterMaterialsByName(name) {
    let filtered = materials.filter(m => m.name.toLowerCase().includes(name.toLowerCase()));
    console.log(`Filtered Materials by name "${name}":`);
    console.table(filtered);
}

// Filter Materials By Quantity
function filterMaterialsByQty(minQty) {
    let filtered = materials.filter(m => m.qty >= minQty);
    console.log(`Filtered Materials with quantity >= ${minQty}:`);
    console.table(filtered);
}
