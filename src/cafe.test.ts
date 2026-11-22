
import { describe, it, expect } from "vitest";
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

function describeItem(item: MenuItem): string {
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

function filterMenu(
  items: MenuItem[],
  predicate: (item: MenuItem) => boolean
): MenuItem[] {
  return items.filter(predicate);
}

function cheapest(items: MenuItem[], max?: number) {
  const sorted = [...items].sort((a, b) => a.price - b.price);
  max = max === undefined ? items.length : max < 2 ? 1 : max;
  return sorted.slice(0, max);
}

function getNetPrice(item: MenuItem) {
  return item.price * (1 - (item.discountPercent ?? 0) * 100);
}

function firstMatch<T>(
  data: T[],
  criteria: (d: T) => boolean
): T | undefined {
  return data.find(criteria);
}

// Returns a new item with the changes
function updateItem(item: MenuItem, changes: Partial<MenuItem>) {
  return { ...item, ...changes };
}

function kitchenTicket(
  item: MenuItem
): Readonly<Pick<MenuItem, "name" | "course">> {
  return {
    name: item.name,
    course: item.course,
  };
}

function allergyCard(
  item: MenuItem
): Omit<MenuItem, "nutrition"> & {
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

describe("Cafe menu functions", () => {

  // describeItem()

  it("should describe a menu item", () => {
    expect(describeItem(risotto)).toBe(
      "Mushroom Risotto (main) - EUR 14.00"
    );
  });

  // lineTotal() and orderTotal()

  it("should calculate an individual order line total", () => {
    expect(lineTotal(risotto)).toBe(14);
    expect(lineTotal(lunchCombo)).toBe(10);
  });

  it("should calculate the total order value", () => {
    expect(orderTotal(currentOrder)).toBe(29.5);
  });

  // filterMenu()

  it("should filter menu items by calories", () => {
    const result = filterMenu(
      menu,
      (i) => i.nutrition.calories < 500
    );

    expect(result).toEqual([soup, brownie]);
  });

  // cheapest()

  it("should return the two cheapest menu items", () => {
    const result = cheapest(menu, 2);

    expect(result).toEqual([soup, brownie]);
  });

  it("should return the cheapest item when max is less than 2", () => {
    expect(cheapest(menu, 1)).toEqual([soup]);
    expect(cheapest(menu, 0)).toEqual([soup]);
  });

  it("should return all items sorted by price when max is omitted", () => {
    expect(cheapest(menu)).toEqual([soup, brownie, risotto]);
  });

  it("should not modify the original menu when sorting", () => {
    const originalMenu = [...menu];

    cheapest(menu, 2);

    expect(menu).toEqual(originalMenu);
  });

  // firstMatch()

  it("should find the first matching menu item", () => {
    expect(firstMatch(menu, (i) => i.course === "dessert"))
      .toBe(brownie);
  });

  it("should return undefined when no matching item exists", () => {
    expect(firstMatch(menu, (i) => i.course === "starter" && i.price > 100))
      .toBeUndefined();
  });

  // updateItem() and Partial<MenuItem>

  it("should update an item using Partial<MenuItem>", () => {
    const updated = updateItem(soup, {
      price: 6.0,
      discountPercent: 10,
    });

    expect(updated.price).toBe(6);
    expect(updated.discountPercent).toBe(10);
    expect(updated.name).toBe("Roast Tomato Soup");

    // Original item must remain unchanged
    expect(soup.price).toBe(5.5);
    expect(soup.discountPercent).toBeUndefined();
  });

  // kitchenTicket() and Readonly<Pick<>>

  it("should create a kitchen ticket with only name and course", () => {
    const ticket = kitchenTicket(brownie);

    expect(ticket).toEqual({
      name: "Chocolate Brownie",
      course: "dessert",
    });

    expect(ticket).not.toHaveProperty("price");
    expect(ticket).not.toHaveProperty("nutrition");
  });

  // allergyCard() and Omit<>

  it("should create an allergy card without nutrition", () => {
    const card = allergyCard(brownie);

    expect(card).toEqual({
      id: 3,
      name: "Chocolate Brownie",
      course: "dessert",
      price: 6,
      warning: "Contains: milk, eggs, gluten",
    });

    expect(card).not.toHaveProperty("nutrition");
  });

  // describeItem() with combo items

  it("should describe individual items inside a combo deal", () => {
    expect(describeItem(lunchCombo.items[0])).toBe(
      "Roast Tomato Soup (starter) - EUR 5.50"
    );

    expect(describeItem(lunchCombo.items[1])).toBe(
      "Chocolate Brownie (dessert) - EUR 6.00"
    );
  });

  it("should apply the discount when calculating the item price", () => {
    const discountedPrice = getNetPrice(brownie);
  
    expect(discountedPrice).toBe(5.1);
  });

});
