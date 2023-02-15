import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: '#b944d6',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            borderColor: '#0F97C7',
            tension: 0.4
        }
    ]
};

const pieData = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [540, 325, 702, 421],
            backgroundColor: ['#0F97C7', '#b944d6', '#e2841a', '#10b163']
        }
    ]
};

const polarData = {
    datasets: [
        {
            data: [11, 16, 7, 3],
            backgroundColor: ['#0F97C7', '#b944d6', '#e2841a', '#10b163'],
            label: 'My dataset'
        }
    ],
    labels: ['Blue', 'Purple', 'Orange', 'Green']
};

const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#0F97C7',
            borderColor: '#0F97C7',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#e2841a',
            borderColor: '#e2841a',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

const doughnutData = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: ['#e2841a', '#0F97C7', '#10b163'],
            hoverBackgroundColor: ['#edb575', '#6fc0dd', '#6fd0a1']
        }
    ]
};

const radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(15,151,199,0.2)',
            borderColor: 'rgba(15,151,199,1)',
            pointBackgroundColor: 'rgba(15,151,199,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(15,151,199,1)',
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: 'rgba(185,68,214,0.2)',
            borderColor: 'rgba(185,68,214,1)',
            pointBackgroundColor: 'rgba(185,68,214,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(185,68,214,1)',
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};

const ChartDemo = (props: any) => {
    const [lineOptions, setLineOptions] = useState<any[]>([]);
    const [barOptions, setBarOptions] = useState<any[]>([]);
    const [pieOptions, setPieOptions] = useState<any[]>([]);
    const [polarOptions, setPolarOptions] = useState<any[]>([]);
    const [radarOptions, setRadarOptions] = useState<any[]>([]);

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        } as any;

        const barOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        } as any;

        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            }
        } as any;

        const polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        } as any;

        const radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        } as any;

        setLineOptions(lineOptions);
        setBarOptions(barOptions);
        setPieOptions(pieOptions);
        setPolarOptions(polarOptions);
        setRadarOptions(radarOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        } as any;

        const barOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        } as any;

        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            }
        } as any;

        const polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        } as any;

        const radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        } as any;

        setLineOptions(lineOptions);
        setBarOptions(barOptions);
        setPieOptions(pieOptions);
        setPolarOptions(polarOptions);
        setRadarOptions(radarOptions);
    };

    useEffect(() => {
        if (props.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);

    return (
        <div className="grid p-fluid">
            <div className="col-12 lg:col-6">
                <div className="card">
                    <h5>Linear Chart</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
                <div className="card flex flex-column align-items-center">
                    <h5>Pie Chart</h5>
                    <Chart type="pie" data={pieData} options={pieOptions} style={{ width: '50%' }} />
                </div>

                <div className="card flex flex-column align-items-center">
                    <h5>Polar Area Chart</h5>
                    <Chart type="polarArea" data={polarData} options={polarOptions} style={{ width: '50%' }} />
                </div>
            </div>
            <div className="col-12 lg:col-6">
                <div className="card">
                    <h5>Bar Chart</h5>
                    <Chart type="bar" data={barData} options={barOptions} />
                </div>

                <div className="card flex flex-column align-items-center">
                    <h5>Doughnut Chart</h5>
                    <Chart type="doughnut" data={doughnutData} options={pieOptions} style={{ width: '50%' }} />
                </div>

                <div className="card flex flex-column align-items-center">
                    <h5>Radar Chart</h5>
                    <Chart type="radar" data={radarData} options={radarOptions} style={{ width: '50%' }} />
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps: any, nextProps: any) {
    return prevProps.location.pathname === nextProps.location.pathname && prevProps.colorMode === nextProps.colorMode;
};

export default React.memo(ChartDemo, comparisonFn);
