PROJECT=graoupack
COFFEE_SOURCES := $(wildcard $(PROJECT)/*/*.coffee $(PROJECT)/*/*/*.coffee)
COFFEE_OBJS := $(patsubst %.coffee, %.js, $(COFFEE_SOURCES))

all: coffee
	echo steal/js $(PROJECT)/scripts/build.js
doc:
	documentjs/doc $(PROJECT)
clean:
	rm -rf $(PROJECT)/production.css \
	  $(PROJECT)/production.js \
	  $(PROJECT)/docs.html \
	  $(PROJECT)/docs \
	  $(COFFEE_OBJS)

%.js: %.coffee
	coffee --compile $<

coffee: $(COFFEE_OBJS)

coffee-and-watch:
	coffee --compile --watch $(COFFEE_SOURCES)

.PHONY: clean doc all coffee
