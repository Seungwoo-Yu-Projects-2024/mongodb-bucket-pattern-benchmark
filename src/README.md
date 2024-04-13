## Results

### Incremental insertion speed for bulk of 86000 (sub) documents

```js
[
  {
    'Task Name': 'bucket',
    'ops/sec': '0',
    'Average Time (ns)': 1789390707.9200006,
    Margin: '±0.33%',
    Samples: 100
  },
  {
    'Task Name': 'normal',
    'ops/sec': '0',
    'Average Time (ns)': 4705961403.859994,
    Margin: '±1.38%',
    Samples: 100
  },
  {
    'Task Name': 'timeseries',
    'ops/sec': '0',
    'Average Time (ns)': 7860775789.190009,
    Margin: '±1.27%',
    Samples: 100
  }
]
```

### Insertion speed for bulk of 864000 (sub) documents
```js
[
    {
        'Task Name': 'bucket - 864000 insertion',
        'ops/sec': '0',
        'Average Time (ns)': 53729202630,
        Margin: '±1.28%',
        Samples: 10
    },
    {
        'Task Name': 'normal - 864000 insertion',
        'ops/sec': '0',
        'Average Time (ns)': 60858251730.000015,
        Margin: '±3.89%',
        Samples: 10
    },
    {
        'Task Name': 'timeseries - 864000 insertion',
        'ops/sec': '0',
        'Average Time (ns)': 57737074490.00002,
        Margin: '±1.38%',
        Samples: 10
    }
]
```
