"""
    GUI for search bar and entities that are investigated in this visualisation
"""
import ipywidgets as widgets
from IPython.display import display


class UISearchBar:

    def __init__(self):
        self.search_bar = widgets.Text(description='Node ID:')
        # self.output = widgets.Text(description='...', disabled = True)
        # self.search_bar.on_trait_change(self.showEnteredText)
        
        self.entity1 = widgets.Button(description='Mar de la Vida OJSC')
        self.entity2 = widgets.Button(description='979893388')
        self.entity3 = widgets.Button(description='Oceanfront Oasis Inc Carrie')
        self.entity4 = widgets.Button(description='8327')
        self.entity1.on_click(lambda _: self.select(self.entity1.description))
        self.entity2.on_click(lambda _: self.select(self.entity2.description))
        self.entity3.on_click(lambda _: self.select(self.entity3.description))
        self.entity4.on_click(lambda _: self.select(self.entity4.description))
        self.searchBarUI = widgets.VBox([self.search_bar, widgets.HBox([self.entity1, self.entity2,self.entity3, self.entity4,])])

    def select(self, description):
        self.search_bar.value = description

    def getValue(self):
        return self.search_bar.value
    
    def show(self):
        display(self.searchBarUI)
        return self
