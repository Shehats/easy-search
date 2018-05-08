export const isPrimitive = (type: any): boolean => (typeof type === "string" 
  || typeof type === "number" || typeof type === "boolean");

export const isNumber = (type: any): boolean => (typeof type === "number")

export const isBoolean = (type: any): boolean => (typeof type === "boolean")

export const isString = (type: any): boolean => (typeof type === "string")