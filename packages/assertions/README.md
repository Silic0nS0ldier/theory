

npm true-equals


## Snapshots

testFunctionName

1

```
{
    foo: Foo {
        bar: "foobar",
    },
    bar: Bar(...) {
        customProp: "barfoo",
    },
    foobar: FooBar(...),
    barbar: BarBar,
}
```

```json
{
    "type": "object",
    "properties": {
        "foo": {
            "type": "class-instance",
            "properties": {
                "bar": "foobar"
            }
        },
        "foo": {
            "type": "function",
            "properties": {
                "customProp": "barfoo"
            }
        },
        "foobar": {
            "type": "function"
        },
        "barbar": {
            "type": "class-definition",
            // ...
        }
    }
}
```
