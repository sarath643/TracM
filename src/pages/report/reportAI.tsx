import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Entry } from '../home';
import { useIncomeExpenseStore } from '@/store/dataStore';
import CustomToast from '@/components/customToast';
import { useNavigate } from 'react-router-dom';
import { CustomDotLoader } from '@/components/loaders';
import { refactorTextContent } from '@/utils/validation';
import { appConfig } from '@/app_config';

interface AIAnalysisReport {
  summary: string;
  recommendations: string[];
}

const generateReportAI = async (financialData: Entry[]) => {
  try {
    const response = await fetch(appConfig.apiUrl + '/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: financialData }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    const result = await response.json();
    console.log('Report generated:', result);

    return result; // This will contain { summary, recommendations }
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div>
      <div
        className={`relative rounded-lg shadow-md overflow-hidden dark:bg-gray-900 dark:text-white bg-white text-gray-800 ${className}`}>
        <div className='absolute top-2 right-2'></div>
        {children}
      </div>
    </div>
  );
};

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg sm:text-xl font-semibold ${className}`}>{children}</h3>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const ReportAI = () => {
  const { entries } = useIncomeExpenseStore();
  const navigate = useNavigate();

  useEffect(() => {
    handleGenerateReport(entries);
    window.scrollTo(0, 0);
  }, [entries]);

  const [aiReport, setAIReport] = useState<AIAnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (data: Entry[]) => {
    setIsLoading(true);
    if (data.length >= 5) {
      try {
        const report = await generateReportAI(data);
        setAIReport(report);
      } catch (error) {
        console.error('Error generating AI report:', error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Data is not enough to generate report');
      CustomToast('Data is not enough to generate report', 'error');
      navigate('/dashboard');
    }
  };

  const data = entries;
  const chartData = data.reduce(
    (acc: { Category: string; Income: number; Expense: number }[], entry: Entry) => {
      const existingEntry = acc.find(
        (item: { Category: string; Income: number; Expense: number }) =>
          item.Category === entry.category
      );
      if (existingEntry) {
        existingEntry[entry.type === 'income' ? 'Income' : 'Expense'] += entry.amount;
      } else {
        acc.push({
          Category: entry.category,
          Income: entry.type === 'income' ? entry.amount : 0,
          Expense: entry.type === 'expense' ? entry.amount : 0,
        });
      }
      return acc;
    },
    [] as { Category: string; Income: number; Expense: number }[]
  );

  return isLoading ? (
    <div className='flex items-center justify-center w-screen h-screen bg-white dark:bg-black '>
      <div className='flex items-center justify-center h-16 pb-4'>
        <CustomDotLoader numberOfDots={6} className='w-2 h-2' />
      </div>
    </div>
  ) : (
    <div className='relative flex w-screen min-h-screen pt-16 pb-10 sm:pt-24'>
      <div className='w-full mx-auto space-y-4 transition-colors duration-200 bg-white max-w-7xl dark:bg-black '>
        <div className='p-4 text-gray-900 sm:p-10 dark:text-white'>
          <div className='grid w-full max-w-3xl mx-auto space-y-4 sm:space-y-10'>
            <Card className='col-span-1 '>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey='Category' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='Income' fill='#008430' />
                    <Bar dataKey='Expense' fill='#ba0000' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {aiReport && (
                  <div>
                    <p
                      className='mb-2'
                      dangerouslySetInnerHTML={{ __html: refactorTextContent(aiReport.summary) }}
                    />
                    <h3 className='py-3 pt-10 text-lg font-bold'>Recommendations:</h3>
                    <ul>
                      {aiReport.recommendations.map((rec, index) => (
                        <li
                          className='my-4'
                          key={index}
                          dangerouslySetInnerHTML={{ __html: refactorTextContent(rec) }}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAI;
