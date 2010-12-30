PROJECT=graoupack
COFFEE_SOURCES := $(shell find $(PROJECT) -type f -name '*.coffee')
# COFFEE_OBJS := $(patsubst %.coffee, dist/%.js, $(COFFEE_SOURCES))
COFFEE_OBJS := $(patsubst %.coffee, %.js, $(COFFEE_SOURCES))

all: coffee
	steal/js $(PROJECT)/scripts/build.js
doc:
	documentjs/doc $(PROJECT)
clean:
	rm -rf $(PROJECT)/production.css \
	  $(PROJECT)/production.js \
	  $(PROJECT)/docs.html \
	  $(PROJECT)/docs \
	  $(COFFEE_OBJS)

# dist/%.js: %.coffee
%.js: %.coffee
	coffee --output $(@D) --compile $<

coffee: $(COFFEE_OBJS)

coffee-and-watch:
	coffee --compile --watch $(COFFEE_SOURCES)

.PHONY: clean doc all coffee
