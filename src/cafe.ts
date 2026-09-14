import { MenuItem, ComboDeal, OrderLine } from "./menuTypes";

// ---------------------------------------------------------------
// 1. THE MENU
// ---------------------------------------------------------------

const soup: MenuItem = {
  id: 1,
  name: "Roast Tomato Soup",
  course: "starter",
  price: 5.5,
  nutrition: {
    calories: 180,
    allergens: ["celery"],
  },
};

const risotto: MenuItem = {
  id: 2,
  name: "Mushroom Risotto",
  course: "main",
  price: 14.0,
  nutrition: {
    calories: 620,
    allergens: ["milk"],
  },
};

const brownie: MenuItem = {
  id: 3,
  name: "Chocolate Brownie",
  course: "dessert",
  price: 6.0,
  nutrition: {
    calories: 450,
    allergens: ["milk", "eggs", "gluten"],
  },
  availableFrom: new Date("2026-09-13"),
  discountPercent: 15,
};

const menu = [soup, risotto, brownie];

const lunchCombo: ComboDeal = {
  id: 101,
  name: "Soup & Sweet",
  items: [soup, brownie],
  price: 10.0,
};

const currentOrder: OrderLine[] = [risotto, lunchCombo, soup];

// ---------------------------------------------------------------
// 2. FUNCTIONS
// ---------------------------------------------------------------

function describe(item: MenuItem): string {
  return `${item.name} (${item.course}) - EUR ${item.price.toFixed(2)}`;
}

function lineTotal(line: OrderLine) {
  if ("items" in line) {
    return line.price; // Combos are sold at their bundle price.
  }
  return line.price;
}

function orderTotal(lines: OrderLine[]) {
  return lines.reduce((total, line) => total + lineTotal(line), 0);
}

function filterMenu(items: MenuItem[], predicate: (item: MenuItem) => boolean): MenuItem[] {
  return items.filter(predicate);
}

function cheapest(items: MenuItem[], max?: number) {
  const sorted = items.sort((a, b) => a.price - b.price);
  max = max === undefined ? items.length : max < 2 ? 1 : max;
  return sorted.slice(0, max);
}

function firstMatch<T>(data: T[], criteria: (d: T) => boolean): T | undefined {
  return data.find(criteria);
}

// updateItem() doesn't actually update the item; it returns a new item with the changes
function updateItem(item: MenuItem, changes: Partial<MenuItem>) {
  return { ...item, ...changes };
}

function kitchenTicket(item: MenuItem): Readonly<Pick<MenuItem, "name" | "course">> {
  return {
    name: item.name,
    course: item.course,
  };
}

function allergyCard(item: MenuItem): Omit<MenuItem, "nutrition"> & {
  warning: string;
} {
  return {
    id: item.id,
    name: item.name,
    course: item.course,
    price: item.price,
    warning: `Contains: ${item.nutrition.allergens.join(", ")}`,
  };
}

// ---------------------------------------------------------------
// 3. TESTS
// ---------------------------------------------------------------

console.log(describe(risotto));
console.log(orderTotal(currentOrder));
console.log(filterMenu(menu, (i) => i.nutrition.calories < 500));
console.log(cheapest(menu, 2));
console.log(cheapest(menu));
console.log(firstMatch(menu, (i) => i.course === "dessert"));
console.log(updateItem(soup, { price: 6.0, discountPercent: 10 }));
console.log(kitchenTicket(brownie));
console.log(allergyCard(brownie));

// kitchenTicket(brownie).name = "Something else";
// The compiler reject the line above because it's immutable

console.log(describe(lunchCombo.items[0]), describe(lunchCombo.items[1])); // describe() only accepts MenuItem
console.log(updateItem(soup, { price: 7.00 })); // price is a number, not a string
console.log(firstMatch(menu, (i) => i.nutrition.calories < 300)); // 'calories' field is in 'nutrition' field
