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
    // Check if enough materials are available
    if (materials[0].qty < laundry.qty || materials[1].qty < laundry.qty) {
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

