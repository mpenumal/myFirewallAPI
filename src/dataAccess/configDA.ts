export const ruleListConfig = {
  index: 'rulelist',
  type: 'doc'
}

export const ruleConfig = {
  index: 'rule',
  type: 'doc'
}

// add more logic to apply ruleLists as per necessity
export const applicableRulesConfig = [
  {
    time: 'day',
    ruleListID: 1
  },
  {
    time: 'night',
    ruleListID: 2
  }
]
