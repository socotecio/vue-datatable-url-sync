import {elementToArrayOfInt, elementToArrayOfString, extractBooleanValue, extractIntegerValue, getSortsArrayFromOrdering, getOrderingFromSortArray} from "@/utils/helpers"

describe('helpers.ts', () => {
  describe('elementToArrayOfInt', () => {

    it('transform a string to array of int', () => {
      const element = '1';
      const returnValue = elementToArrayOfInt(element);

      expect(returnValue).toEqual([1])
    })

    it('transform a int to array of int', () => {
      const element = 1;
      const returnValue = elementToArrayOfInt(element);

      expect(returnValue).toEqual([1])
    })

    it('transform an array of string to array of int', () => {
      const element = ["1", "2", "3"];
      const returnValue = elementToArrayOfInt(element);

      expect(returnValue).toEqual([1, 2, 3])
    })

    it('transform a string not parsable to 0', () => {
      const element = 'test';
      const returnValue = elementToArrayOfInt(element);

      expect(returnValue).toEqual([0])
    })

  })

  describe('elementToArrayOfString', () => {

    it('transform a string to array of string', () => {
      const element = '1';
      const returnValue = elementToArrayOfString(element);

      expect(returnValue).toEqual(["1"])
    })

    it('transform an array of string to array of string', () => {
      const element = ["1", "2", "3"];
      const returnValue = elementToArrayOfString(element);

      expect(returnValue).toEqual(["1", "2", "3"])
    })

  })

  describe('extractBooleanValue', () => {

    it('transform a true string to true boolean', () => {
      const element = 'true';
      const returnValue = extractBooleanValue(element);

      expect(returnValue).toEqual(true)
    })

    it('transform a false of string to false boolean', () => {
      const element = "false";
      const returnValue = extractBooleanValue(element);

      expect(returnValue).toEqual(false)
    })

    it('transform a non boolean string to false', () => {
      const element = "falsee";
      const returnValue = extractBooleanValue(element, null);

      expect(returnValue).toEqual(false)
    })

    it('transform a null value to default value', () => {
      const element = null;
      let returnValue = extractBooleanValue(element, true);
      expect(returnValue).toEqual(true)

      returnValue = extractBooleanValue(element, false);
      expect(returnValue).toEqual(false)

      returnValue = extractBooleanValue(element, null);
      expect(returnValue).toEqual(null)
    })

  })

  describe('extractIntegerValue', () => {

    it('transform a number string to int', () => {
      const element = '10';
      const returnValue = extractIntegerValue(element);

      expect(returnValue).toEqual(10)
    })

    it('transform a wrong number string to default value', () => {
      const element = "a10";
      const returnValue = extractIntegerValue(element, 20);

      expect(returnValue).toEqual(20)
    })

  })

  describe('getSortsArrayFromOrdering', () => {

    it("return default VuetifySortArraysObject if no value", () => {
      const element = null;
      const returnValue = getSortsArrayFromOrdering(element);

      expect(returnValue).toEqual({ sortBy: [], sortDesc: [] })
    })

    it("return correct VuetifySortArraysObject if positive ordering", () => {
      const element = ["ordering_field"];
      const returnValue = getSortsArrayFromOrdering(element);

      expect(returnValue).toEqual({ sortBy: [{key: "ordering_field", order: "asc"}], sortDesc: [] })
    })

    it("return correct VuetifySortArraysObject if negative ordering", () => {
      const element = ["-ordering_field"];
      const returnValue = getSortsArrayFromOrdering(element);

      expect(returnValue).toEqual({ sortBy: [{key: "ordering_field", order: "desc"}], sortDesc: [] })
    })
  })

  describe('getOrderingFromSortArray', () => {

    it("return correct ordering if positive ordering", () => {
      const sortBy: { key: string; order: 'asc' | 'desc'; }[] = [{key: "ordering_field", order: "asc"}];
      const sortDesc: boolean[] = [];
      const returnValue = getOrderingFromSortArray(sortBy, sortDesc);

      expect(returnValue).toEqual(["ordering_field"])
    })

    it("return correct ordering if negative ordering", () => {
      const sortBy: { key: string; order: 'asc' | 'desc'; }[] = [{key: "ordering_field", order: "desc"}];
      const sortDesc: boolean[] = [];
      const returnValue = getOrderingFromSortArray(sortBy, sortDesc);

      expect(returnValue).toEqual(["-ordering_field"])
    })
  })
})