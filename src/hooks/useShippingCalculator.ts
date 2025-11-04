"use client";

import { useEffect, useState } from "react";

interface ShippingCalculation {
  cost: number;
  formattedCost: string;
  loading: boolean;
  error: string | null;
}

export function useShippingCalculator(department: string | null, city: string | null) {
  const [calculation, setCalculation] = useState<ShippingCalculation>({
    cost: 0,
    formattedCost: "$0",
    loading: false,
    error: null,
  });

  useEffect(() => {
    // Reset if department or city is empty
    if (!department || !city) {
      setCalculation({
        cost: 0,
        formattedCost: "$0",
        loading: false,
        error: null,
      });
      return;
    }

    // Calculate shipping cost
    const calculateCost = async () => {
      setCalculation((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ department, city }),
        });

        if (!response.ok) {
          throw new Error("Failed to calculate shipping cost");
        }

        const data = await response.json();

        setCalculation({
          cost: data.cost,
          formattedCost: data.formattedCost,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error calculating shipping cost:", error);
        setCalculation({
          cost: 0,
          formattedCost: "$0",
          loading: false,
          error: "No se pudo calcular el costo de envío",
        });
      }
    };

    calculateCost();
  }, [department, city]);

  return calculation;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/shipping/calculate");
        const data = await response.json();
        setDepartments(data.departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading };
}

export function useCities(department: string | null) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!department) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/shipping/calculate?department=${encodeURIComponent(department)}`
        );
        const data = await response.json();
        setCities(data.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [department]);

  return { cities, loading };
}
