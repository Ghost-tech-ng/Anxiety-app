import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnxietyEntry } from '../types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const STORAGE_KEY = '@mindfulmoments_anxiety_log';

export const useAnxietyLog = () => {
  const [entries, setEntries] = useState<AnxietyEntry[]>([]);

  const loadEntries = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setEntries(parsed.sort((a: AnxietyEntry, b: AnxietyEntry) => b.timestamp - a.timestamp));
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }, []);

  const addEntry = useCallback(
    async (entry: Omit<AnxietyEntry, 'id' | 'timestamp'>) => {
      try {
        // Load current entries from storage to avoid stale state
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const currentEntries = saved ? JSON.parse(saved) : [];

        const newEntry: AnxietyEntry = {
          ...entry,
          id: Date.now().toString(),
          timestamp: Date.now(),
        };

        const updatedEntries = [newEntry, ...currentEntries];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
        setEntries(updatedEntries);
        return newEntry;
      } catch (error) {
        console.error('Error adding entry:', error);
        throw error;
      }
    },
    []
  );

  const exportToPDF = useCallback(async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                padding: 20px;
                background-color: #f5f5f5;
              }
              h1 {
                color: #87A878;
                border-bottom: 2px solid #87A878;
                padding-bottom: 10px;
              }
              .entry {
                background-color: white;
                padding: 15px;
                margin: 15px 0;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .date {
                font-weight: bold;
                color: #333;
              }
              .intensity {
                display: inline-block;
                background-color: #87A878;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 14px;
                margin-left: 10px;
              }
              .symptoms {
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .symptom {
                background-color: #E5D4C1;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <h1>MindfulMoments Anxiety Log</h1>
            <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Entries:</strong> ${entries.length}</p>
            ${entries
          .map(
            (entry) => `
              <div class="entry">
                <div>
                  <span class="date">${new Date(entry.timestamp).toLocaleString()}</span>
                  <span class="intensity">${entry.intensity}/10</span>
                </div>
                <div class="symptoms">
                  ${entry.symptoms.map((symptom) => `<span class="symptom">${symptom}</span>`).join('')}
                </div>
              </div>
            `
          )
          .join('')}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Anxiety Log',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  }, [entries]);

  return {
    entries,
    loadEntries,
    addEntry,
    exportToPDF,
  };
};
