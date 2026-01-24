import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Award, Leaf, Users, Shield, Database, Search, Download, ExternalLink, FileText, CheckCircle } from 'lucide-react';

const ESGPlatform = () => {
  const [selectedCompany, setSelectedCompany] = useState('AAPL');
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedFramework, setSelectedFramework] = useState('GRI');
  const [activeTab, setActiveTab] = useState('overview');
  const [dataSource, setDataSource] = useState('finnhub');
  const [finnhubKey, setFinnhubKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);

  const externalDatasets = {
    kaggle_sp500: {
      name: 'S&P 500 ESG Dataset',
      provider: 'Kaggle',
      companies: '500+',
      format: 'CSV',
      url: 'https://www.kaggle.com/datasets/rikinzala/s-and-p-500-esg-and-stocks-data-2023-24',
      year: '2024'
    },
    kaggle_public: {
      name: 'Public Company ESG Ratings',
      provider: 'Kaggle',
      companies: '5,000+',
      format: 'CSV',
      url: 'https://www.kaggle.com/datasets/alistairking/public-company-esg-ratings-dataset',
      year: '2024'
    },
    github_esg: {
      name: 'ESG Annotated Dataset',
      provider: 'GitHub',
      companies: '8,467 entries',
      format: 'CSV',
      url: 'https://github.com/LCYgogogo/ESG-dataset',
      year: '2024'
    },
    world_bank: {
      name: 'World Bank Sovereign ESG',
      provider: 'World Bank',
      companies: '200+ countries',
      format: 'CSV/Excel',
      url: 'https://esgdata.worldbank.org',
      year: '2024'
    },
    msci_tool: {
      name: 'MSCI ESG Ratings Tool',
      provider: 'MSCI',
      companies: '8,500+',
      format: 'Web Interface',
      url: 'https://www.msci.com/esg-ratings',
      year: '2024'
    },
    refinitiv: {
      name: 'Refinitiv ESG Scores',
      provider: 'Refinitiv',
      companies: '10,000+',
      format: 'Web API',
      url: 'https://www.refinitiv.com/en/sustainable-finance/esg-scores',
      year: '2024'
    }
  };

  const dataSources = {
    finnhub: {
      name: 'Finnhub ESG API',
      description: 'Real-time ESG scores for 7000+ companies',
      cost: 'Free',
      requiresKey: true,
      endpoint: 'https://finnhub.io/api/v1/stock/esg',
      docs: 'https://finnhub.io/docs/api/company-esg-score'
    },
    sec_edgar: {
      name: 'SEC EDGAR API',
      description: 'US public company filings',
      cost: 'Free',
      requiresKey: false,
      endpoint: 'https://data.sec.gov/api/xbrl/companyfacts',
      docs: 'https://www.sec.gov/edgar/sec-api-documentation'
    },
    epa: {
      name: 'EPA Envirofacts API',
      description: 'Environmental emissions data',
      cost: 'Free',
      requiresKey: false,
      endpoint: 'https://data.epa.gov/efservice',
      docs: 'https://www.epa.gov/enviro/envirofacts-data-service-api'
    }
  };

  const industryMateriality = {
    technology: {
      environmental: ['Energy Management', 'E-Waste', 'Data Center Efficiency', 'Product Lifecycle', 'Carbon Footprint'],
      social: ['Data Privacy', 'Labor Practices', 'Diversity & Inclusion', 'Supply Chain Labor', 'Employee Wellbeing'],
      governance: ['Data Security', 'Business Ethics', 'Board Diversity', 'Regulatory Compliance', 'IP Protection']
    },
    energy: {
      environmental: ['GHG Emissions', 'Water Management', 'Biodiversity', 'Waste Management', 'Renewable Energy'],
      social: ['Community Relations', 'Health & Safety', 'Indigenous Rights', 'Fair Labor', 'Energy Access'],
      governance: ['Climate Risk Disclosure', 'Lobbying Transparency', 'Executive Compensation', 'Board Independence', 'Compliance']
    },
    finance: {
      environmental: ['Financed Emissions', 'Green Lending', 'Climate Risk', 'Sustainable Investment', 'Operational Footprint'],
      social: ['Financial Inclusion', 'Customer Privacy', 'Fair Lending', 'Community Development', 'Employee Diversity'],
      governance: ['Risk Management', 'Anti-Money Laundering', 'Regulatory Compliance', 'Shareholder Rights', 'Executive Pay']
    },
    manufacturing: {
      environmental: ['Air Quality', 'Water Usage', 'Hazardous Waste', 'Resource Efficiency', 'Circular Economy'],
      social: ['Worker Safety', 'Fair Wages', 'Supply Chain Practices', 'Product Quality', 'Community Impact'],
      governance: ['Supply Chain Oversight', 'Quality Control', 'Compliance', 'Stakeholder Engagement', 'Transparency']
    },
    retail: {
      environmental: ['Sustainable Sourcing', 'Packaging Waste', 'Energy in Stores', 'Transportation', 'Product Lifecycle'],
      social: ['Labor Rights', 'Product Safety', 'Community Impact', 'Diversity', 'Customer Wellbeing'],
      governance: ['Supply Chain Transparency', 'Consumer Protection', 'Data Privacy', 'Business Ethics', 'Board Composition']
    }
  };

  const frameworks = {
    GRI: { name: 'Global Reporting Initiative', weight: { E: 0.33, S: 0.33, G: 0.34 } },
    SASB: { name: 'SASB', weight: { E: 0.30, S: 0.35, G: 0.35 } },
    TCFD: { name: 'TCFD', weight: { E: 0.50, S: 0.20, G: 0.30 } },
    CDP: { name: 'CDP', weight: { E: 0.60, S: 0.15, G: 0.25 } }
  };

  const handleFetchData = async () => {
    if (!selectedCompany) {
      alert('Please enter a company symbol');
      return;
    }

    if (dataSource === 'finnhub' && !finnhubKey) {
      alert('Please enter your Finnhub API key');
      return;
    }

    setIsLoading(true);
    setFetchedData(null);

    try {
      let result;

      if (dataSource === 'finnhub') {
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/esg?symbol=${selectedCompany}&token=${finnhubKey}`
        );
        
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        
        result = {
          source: 'finnhub',
          company: selectedCompany,
          environmental: data.environmentScore || 0,
          social: data.socialScore || 0,
          governance: data.governanceScore || 0,
          totalScore: data.totalScore || 0,
          rawData: data
        };
      } else if (dataSource === 'sec_edgar') {
        const tickerResponse = await fetch(
          'https://www.sec.gov/files/company_tickers.json',
          { headers: { 'User-Agent': 'ESG-Platform contact@example.com' } }
        );
        const tickers = await tickerResponse.json();
        const company = Object.values(tickers).find(t => t.ticker === selectedCompany.toUpperCase());
        
        if (!company) throw new Error('Company not found');
        
        result = {
          source: 'sec_edgar',
          company: selectedCompany,
          companyName: company.title,
          cik: company.cik_str
        };
      }

      setFetchedData(result);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateESGScore = (metrics, framework) => {
    const fw = frameworks[framework];
    
    const environmentalScore = metrics.environmental.reduce((sum, m) => sum + m.score * m.weight, 0);
    const socialScore = metrics.social.reduce((sum, m) => sum + m.score * m.weight, 0);
    const governanceScore = metrics.governance.reduce((sum, m) => sum + m.score * m.weight, 0);
    
    const totalScore = (
      environmentalScore * fw.weight.E +
      socialScore * fw.weight.S +
      governanceScore * fw.weight.G
    );
    
    const finalScore = Math.max(0, Math.min(100, totalScore - (metrics.controversies * 5)));
    
    return {
      total: Math.round(finalScore),
      environmental: Math.round(environmentalScore),
      social: Math.round(socialScore),
      governance: Math.round(governanceScore),
      rating: finalScore >= 80 ? 'AAA' : finalScore >= 70 ? 'AA' : finalScore >= 60 ? 'A' : finalScore >= 50 ? 'BBB' : finalScore >= 40 ? 'BB' : finalScore >= 30 ? 'B' : 'CCC'
    };
  };

  const sampleMetrics = {
    environmental: [
      { metric: 'GHG Emissions', score: fetchedData?.environmental || 72, weight: 0.25, trend: 'improving' },
      { metric: 'Renewable Energy', score: 65, weight: 0.20, trend: 'stable' },
      { metric: 'Water Management', score: 78, weight: 0.15, trend: 'improving' },
      { metric: 'Waste Reduction', score: 82, weight: 0.20, trend: 'improving' },
      { metric: 'Biodiversity', score: 58, weight: 0.20, trend: 'declining' }
    ],
    social: [
      { metric: 'Employee Safety', score: fetchedData?.social || 85, weight: 0.25, trend: 'improving' },
      { metric: 'Diversity', score: 68, weight: 0.20, trend: 'improving' },
      { metric: 'Labor Relations', score: 75, weight: 0.15, trend: 'stable' },
      { metric: 'Community', score: 70, weight: 0.20, trend: 'stable' },
      { metric: 'Human Rights', score: 80, weight: 0.20, trend: 'stable' }
    ],
    governance: [
      { metric: 'Board Independence', score: fetchedData?.governance || 88, weight: 0.25, trend: 'stable' },
      { metric: 'Ethics', score: 82, weight: 0.25, trend: 'improving' },
      { metric: 'Compensation', score: 65, weight: 0.15, trend: 'stable' },
      { metric: 'Shareholder Rights', score: 78, weight: 0.20, trend: 'improving' },
      { metric: 'Transparency', score: 72, weight: 0.15, trend: 'stable' }
    ],
    controversies: 2
  };

  const esgScore = calculateESGScore(sampleMetrics, selectedFramework);

  const peerData = [
    { company: 'Your Company', E: esgScore.environmental, S: esgScore.social, G: esgScore.governance, Total: esgScore.total },
    { company: 'Peer 1', E: 78, S: 72, G: 85, Total: 78 },
    { company: 'Peer 2', E: 65, S: 80, G: 75, Total: 73 },
    { company: 'Peer 3', E: 82, S: 68, G: 80, Total: 77 },
    { company: 'Industry Avg', E: 70, S: 73, G: 78, Total: 74 }
  ];

  const timeSeriesData = [
    { period: 'Q1 2023', E: 65, S: 70, G: 75, Total: 70 },
    { period: 'Q2 2023', E: 68, S: 72, G: 78, Total: 73 },
    { period: 'Q3 2023', E: 70, S: 73, G: 80, Total: 74 },
    { period: 'Q4 2023', E: 72, S: 75, G: 82, Total: 76 },
    { period: 'Q1 2024', E: esgScore.environmental, S: esgScore.social, G: esgScore.governance, Total: esgScore.total }
  ];

  const radarData = [
    { subject: 'Climate', A: esgScore.environmental, B: 70, fullMark: 100 },
    { subject: 'Labor', A: esgScore.social, B: 73, fullMark: 100 },
    { subject: 'Board', A: esgScore.governance, B: 78, fullMark: 100 },
    { subject: 'Risk Mgmt', A: 75, B: 72, fullMark: 100 },
    { subject: 'Transparency', A: 72, B: 75, fullMark: 100 },
    { subject: 'Innovation', A: 80, B: 68, fullMark: 100 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-3 rounded-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">ESG Analysis Platform V2</h1>
                <p className="text-slate-600">Real-time APIs + Comprehensive Datasets</p>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-lg ${
              esgScore.rating.startsWith('A') ? 'bg-green-100 text-green-800' :
              esgScore.rating.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <div className="text-sm font-semibold">ESG Rating</div>
              <div className="text-3xl font-bold">{esgScore.rating}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Symbol</label>
              <input 
                type="text"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL, TSLA, MSFT"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
              <select 
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="technology">Technology</option>
                <option value="energy">Energy</option>
                <option value="finance">Finance</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Framework</label>
              <select 
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {Object.keys(frameworks).map(fw => (
                  <option key={fw} value={fw}>{frameworks[fw].name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-slate-200">
            <nav className="flex gap-2 px-6 overflow-x-auto">
              {['overview', 'pillars', 'materiality', 'peers', 'trends', 'data-sources', 'datasets'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6" />
                  <span className="text-sm font-semibold">Total Score</span>
                </div>
                <div className="text-4xl font-bold">{esgScore.total}</div>
                <div className="text-emerald-100 text-sm mt-1">{fetchedData ? 'Live Data' : 'Sample'}</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">Environmental</span>
                </div>
                <div className="text-4xl font-bold text-slate-800">{esgScore.environmental}</div>
                <div className="text-slate-500 text-sm mt-1">Climate & Resources</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">Social</span>
                </div>
                <div className="text-4xl font-bold text-slate-800">{esgScore.social}</div>
                <div className="text-slate-500 text-sm mt-1">People & Communities</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-700">Governance</span>
                </div>
                <div className="text-4xl font-bold text-slate-800">{esgScore.governance}</div>
                <div className="text-slate-500 text-sm mt-1">Ethics & Leadership</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">ESG Pillar Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Environmental', score: esgScore.environmental, target: 75 },
                    { name: 'Social', score: esgScore.social, target: 75 },
                    { name: 'Governance', score: esgScore.governance, target: 75 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#10b981" name="Current" />
                    <Bar dataKey="target" fill="#94a3b8" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Radar</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Company" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Radar name="Industry" dataKey="B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pillars' && (
          <div className="space-y-6">
            {['environmental', 'social', 'governance'].map(pillar => (
              <div key={pillar} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 capitalize flex items-center gap-2">
                  {pillar === 'environmental' && <Leaf className="w-6 h-6 text-green-600" />}
                  {pillar === 'social' && <Users className="w-6 h-6 text-blue-600" />}
                  {pillar === 'governance' && <Shield className="w-6 h-6 text-purple-600" />}
                  {pillar} Metrics
                </h3>
                <div className="space-y-3">
                  {sampleMetrics[pillar].map((metric, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-700">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-800">{metric.score}</span>
                          {metric.trend === 'improving' && <TrendingUp className="w-5 h-5 text-green-600" />}
                          {metric.trend === 'declining' && <TrendingDown className="w-5 h-5 text-red-600" />}
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.score >= 75 ? 'bg-green-600' :
                            metric.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        Weight: {(metric.weight * 100).toFixed(0)}% | Trend: {metric.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'materiality' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Industry Materiality - {selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(industryMateriality[selectedIndustry]).map(([pillar, issues]) => (
                <div key={pillar} className="border-2 border-slate-200 rounded-lg p-5">
                  <h4 className="font-bold text-slate-800 mb-3 capitalize flex items-center gap-2">
                    {pillar === 'environmental' && <Leaf className="w-5 h-5 text-green-600" />}
                    {pillar === 'social' && <Users className="w-5 h-5 text-blue-600" />}
                    {pillar === 'governance' && <Shield className="w-5 h-5 text-purple-600" />}
                    {pillar}
                  </h4>
                  <ul className="space-y-2">
                    {issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'peers' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Peer Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={peerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="E" fill="#10b981" name="Environmental" />
                <Bar dataKey="S" fill="#3b82f6" name="Social" />
                <Bar dataKey="G" fill="#8b5cf6" name="Governance" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              {peerData.map((peer, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-2 ${
                  peer.company === 'Your Company' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                }`}>
                  <div className="font-semibold text-slate-800 mb-2">{peer.company}</div>
                  <div className="text-2xl font-bold text-slate-900">{peer.Total}</div>
                  <div className="text-sm text-slate-600 mt-1">{peer.Total >= 80 ? 'AAA' : peer.Total >= 70 ? 'AA' : peer.Total >= 60 ? 'A' : 'BBB'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Historical Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="E" stroke="#10b981" strokeWidth={2} name="Environmental" />
                <Line type="monotone" dataKey="S" stroke="#3b82f6" strokeWidth={2} name="Social" />
                <Line type="monotone" dataKey="G" stroke="#8b5cf6" strokeWidth={2} name="Governance" />
                <Line type="monotone" dataKey="Total" stroke="#f59e0b" strokeWidth={3} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'data-sources' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-600" />
                Select Data Source
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(dataSources).map(([key, source]) => (
                  <div
                    key={key}
                    onClick={() => setDataSource(key)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      dataSource === key ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h4 className="font-bold text-slate-800 mb-2">{source.name}</h4>
                    <p className="text-sm text-slate-600 mb-3">{source.description}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded">{source.cost}</span>
                    </div>
                  </div>
                ))}
              </div>

              {dataSources[dataSource]?.requiresKey && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mb-4">
                  <label className="block font-semibold text-blue-900 mb-2">
                    Enter Your Finnhub API Key:
                  </label>
                  <input
                    type="password"
                    value={finnhubKey}
                    onChange={(e) => setFinnhubKey(e.target.value)}
                    placeholder="Get free key at finnhub.io"
                    className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg"
                  />
                  <p className="text-sm text-blue-700 mt-2">
                    Free API key from <a href="https://finnhub.io/register" target="_blank" rel="noopener noreferrer" className="underline">finnhub.io/register</a>
                  </p>
                </div>
              )}

              <button
                onClick={handleFetchData}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Processing...' : (
                  <>
                    <Search className="w-5 h-5" />
                    Fetch Real-Time Data
                  </>
                )}
              </button>
            </div>

            {fetchedData && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">API Response</h3>
                <div className="bg-slate-50 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-sm text-slate-700">{JSON.stringify(fetchedData, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'datasets' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              External ESG Datasets - Free & Legitimate Sources
            </h3>
            <p className="text-slate-600 mb-6">
              Download comprehensive ESG datasets from trusted providers for in-depth analysis.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(externalDatasets).map(([key, dataset]) => (
                <div key={key} className="border-2 border-slate-200 rounded-lg p-5 hover:border-emerald-500 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{dataset.name}</h4>
                      <p className="text-sm text-emerald-600 font-medium">{dataset.provider}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Database className="w-4 h-4" />
                      <span><strong>Coverage:</strong> {dataset.companies}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Download className="w-4 h-4" />
                      <span><strong>Format:</strong> {dataset.format}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <AlertCircle className="w-4 h-4" />
                      <span><strong>Updated:</strong> {dataset.year}</span>
                    </div>
                  </div>
                  
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Access Dataset
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-2">How to Use These Datasets:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Click on any dataset to visit the source</li>
                <li>Download CSV/Excel files to your computer</li>
                <li>Use the data for benchmarking and analysis</li>
                <li>Combine with API data for comprehensive insights</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ESGPlatform;