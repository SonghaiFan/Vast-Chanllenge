"""
    GUI for filter bar
"""
import ipywidgets as widgets
from IPython.display import display

class UIFilterBar:
    def __init__(self):
        self.node_types = ['Person', 'Company', 'Organization']
        self.edge_types = ['Family_Relationship', 'Ownership', 'Partnership']
        
        self.node_checkboxes = [widgets.Checkbox(description=type) for type in self.node_types]
        self.edge_checkboxes = [widgets.Checkbox(description=type) for type in self.edge_types]
        self.node_checkboxes.insert(0,widgets.Label('Node type:'))
        self.edge_checkboxes.insert(0,widgets.Label('Edge type:'))
        self.node_widgets = widgets.HBox(self.node_checkboxes, layout=widgets.Layout(margin='10px'))
        self.edge_widgets = widgets.HBox(self.edge_checkboxes, layout=widgets.Layout(margin='10px'))
        
        self.container = widgets.VBox([self.node_widgets,
                                       self.edge_widgets])
        
    def show(self):
        display(self.container)
        return self