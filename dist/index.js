var react = require('react');

var useFormState = function useFormState(spec, debug) {
  if (debug === void 0) {
    debug = false;
  }

  var _useState = react.useState(spec.states.map(function (state) {
    return state.name;
  })),
      names = _useState[0];

  var _useState2 = react.useState(spec.states.map(function (state) {
    return state["default"];
  })),
      values = _useState2[0],
      setValues = _useState2[1];

  var _useState3 = react.useState(spec.states.map(function (state) {
    return state.mustBeValid;
  })),
      mandatory = _useState3[0];

  var _useState4 = react.useState(spec.states.map(function (state) {
    return state.validator;
  })),
      validators = _useState4[0];

  var _useState5 = react.useState(spec.states.map(function (state) {
    return state.isValid;
  })),
      valids = _useState5[0],
      setValids = _useState5[1];

  var _useState6 = react.useState(spec.states.map(function () {
    return false;
  })),
      needValidations = _useState6[0],
      setNeedValidations = _useState6[1];

  var _useState7 = react.useState(spec.states.map(function () {
    return false;
  })),
      edits = _useState7[0],
      setEdits = _useState7[1];

  var _useState8 = react.useState(spec.states.map(function () {
    return false;
  })),
      warnings = _useState8[0],
      setWarnings = _useState8[1];

  var _useState9 = react.useState(false),
      isValid = _useState9[0],
      setIsValid = _useState9[1];

  var _useState10 = react.useState(false),
      isValidating = _useState10[0],
      setIsValidating = _useState10[1];

  react.useEffect(function () {
    setIsValidating(function () {
      var v = false;
      needValidations.forEach(function (val) {
        if (val) v = true;
      });
      return v;
    });
  }, [needValidations]);
  var validate = react.useCallback(function () {
    needValidations.forEach(function (needsValidation, index) {
      if (needsValidation) {
        setValids(function (prev) {
          var arr = [].concat(prev);
          arr[index] = validators[index](values[index]);
          return arr;
        });
        setNeedValidations(function (prev) {
          var arr = [].concat(prev);
          arr[index] = false;
          return arr;
        });
      }
    });
  }, [needValidations, validators, values]);
  react.useEffect(function () {
    return validate();
  }, [validate]);
  var triggerWarnings = react.useCallback(function () {
    mandatory.forEach(function (isMandatory, index) {
      if (isMandatory) {
        setWarnings(function (prev) {
          var arr = [].concat(prev);
          arr[index] = !needValidations[index] && !valids[index] && edits[index];
          return arr;
        });
      }
    });
  }, [valids, needValidations, edits, mandatory]);
  react.useEffect(function () {
    return triggerWarnings();
  }, [triggerWarnings]);
  react.useEffect(function () {
    if (!isValidating) setIsValid(function () {
      var answer = true;
      mandatory.forEach(function (isMandatory, index) {
        if (isMandatory) if (!valids[index]) answer = false;
      });
      return answer;
    });
  }, [valids, mandatory, isValidating]);
  var onChangeHandler = react.useCallback(function (index, value) {
    setValues(function (prev) {
      var arr = [].concat(prev);
      arr[index] = value;
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr[index] = true;
      return arr;
    });
    setEdits(function (prev) {
      var arr = [].concat(prev);
      arr[index] = true;
      return arr;
    });
  }, []);
  var triggerValidation = react.useCallback(function () {
    setEdits(function (prev) {
      var arr = [].concat(prev);
      arr.fill(true);
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr.fill(true);
      return arr;
    });
  }, []);
  var reset = react.useCallback(function () {
    setValues(spec.states.map(function (state) {
      return state["default"];
    }));
    setValids(spec.states.map(function (state) {
      return state.isValid;
    }));
    setNeedValidations(spec.states.map(function () {
      return false;
    }));
    setIsValid(false);
  }, [spec]);
  var resetState = react.useCallback(function (index) {
    setValues(function (prev) {
      var arr = [].concat(prev);
      arr[index] = spec.states[index]["default"];
      return arr;
    });
    setValids(function (prev) {
      var arr = [].concat(prev);
      arr[index] = spec.states[index].defaultIsValid;
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr[index] = false;
      return arr;
    });
  }, [spec]);
  var setState = react.useCallback(function (index, value, isValid, needsValidation) {
    setValues(function (prev) {
      var arr = [].concat(prev);
      arr[index] = value;
      return arr;
    });
    setValids(function (prev) {
      var arr = [].concat(prev);
      arr[index] = isValid;
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr[index] = needsValidation;
      return arr;
    });
  }, []);

  var _useState11 = react.useState(spec.states.map(function (state, index) {
    return function (value) {
      return onChangeHandler(index, value);
    };
  })),
      onChangeHandlers = _useState11[0];

  var _useState12 = react.useState(spec.states.map(function (state, index) {
    return function () {
      return resetState(index);
    };
  })),
      resetStates = _useState12[0];

  var _useState13 = react.useState(spec.states.map(function (state, index) {
    return function (value, isValid, needsValidation) {
      return setState(index, value, isValid, needsValidation);
    };
  })),
      setStates = _useState13[0];

  react.useEffect(function () {
    if (debug) console.log('form state: names: ', names);
  }, [debug, names]);
  react.useEffect(function () {
    if (debug) console.log('form state: values: ', values);
  }, [debug, values]);
  react.useEffect(function () {
    if (debug) console.log('form state: edits: ', edits);
  }, [debug, edits]);
  react.useEffect(function () {
    if (debug) console.log('form state: needValidations: ', needValidations);
  }, [debug, needValidations]);
  react.useEffect(function () {
    if (debug) console.log('form state: valids: ', valids);
  }, [debug, valids]);
  react.useEffect(function () {
    if (debug) console.log('form state: validators: ', validators);
  }, [debug, validators]);
  react.useEffect(function () {
    if (debug) console.log('form state: mandatory: ', mandatory);
  }, [debug, mandatory]);
  react.useEffect(function () {
    if (debug) console.log('form state: warnings: ', warnings);
  }, [debug, warnings]);
  react.useEffect(function () {
    if (debug) console.log('form state: isValidating: ', isValidating);
  }, [debug, isValidating]);
  react.useEffect(function () {
    if (debug) console.log('form state: isValid: ', isValid);
  }, [debug, isValid]);
  react.useEffect(function () {
    if (debug) console.log('form state: onChangeHandlers: ', onChangeHandlers);
  }, [debug, onChangeHandlers]);
  return [isValid, isValidating, values, warnings, onChangeHandlers, triggerWarnings, triggerValidation, reset, resetStates, setStates, names];
};

module.exports = useFormState;
//# sourceMappingURL=index.js.map
