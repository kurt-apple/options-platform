# options-platform
A paired-down and purpose-built options trading web ui

# Objective
Trading platforms are often rife with instrumentation and visual noise. When a strategy is well-established, less of this becomes necessary, and in fact, I wonder if having it there in the first place makes it harder to establish a consistent trading strategy. I am writing a custom trading platform using a broker API in order to improve my trading discipline - because I can.

# Brokers
I have previously used Robinhood, TastyTrade, TD Ameritrade, and others to trade options. Commissions, fills, etc vary. I am trying Tradier now because of their relatively low commissions and API that seems to support multi-leg options trades very well. I will update this doc with findings if I must switch.

# First Goals
- Sketch out a trading workflow, including some filters on options pricing, volatility, and other core metrics of the underlying and its derivatives
- Highlight when a trade is ready to manage
- Give few options when a trade is clicked
- Rolling and calendar trade management: make these easier to visualize and manipulate

# Long Term Goals
- SOME automated management
- Trade journaling
- Performance Statistics
